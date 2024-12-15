import Types "../types/Types";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Error "mo:base/Error";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Order "mo:base/Order";
import Int "mo:base/Int";
import UserService "UserService";
import Utils "../lib/Utils";
import PlatformService "PlatformService";

module TicketService {
    public func createBuyTicketTx(
        caller : Principal,
        events : Types.Events,
        transactions : Types.Transactions,
        eventId : Text,
    ) : async Result.Result<Types.Transaction, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed");
        };

        switch (events.get(eventId)) {
            case (null) {
                return #err("Event not found");
            };
            case (?event) {
                if (Principal.equal(event.owner, caller)) {
                    return #err("Owner of event can't buy own event");
                };

                if (event.availableTickets <= 0) {
                    return #err("Ticket already sold out");
                };

                let balance = await UserService.getLedgerBalance(caller);

                if (balance < event.ticketPrice) {
                    return #err("Insufficient ICP balance");
                };

                var platformFee = Utils.calculatePlatformFee(event.ticketPrice);
                let netAmount = Nat.sub(event.ticketPrice, platformFee);

                let newTransactionId = Utils.generateUUID(caller, event.title);

                let newTransaction : Types.Transaction = {
                    id = newTransactionId;
                    from = caller;
                    to = event.owner;
                    amount = netAmount;
                    transactionType = #buyTicket;
                    txStatus = #pending;
                    eventId = ?event.id;
                    platformFee = platformFee;
                    createdAt = Time.now();
                    updatedAt = null;
                };

                transactions.put(newTransactionId, newTransaction);

                return #ok(newTransaction);
            };
        };
    };

    public func finalizeBuyTicketTx(
        caller : Principal,
        users : Types.Users,
        platformBalance : Types.PlatformBalance,
        tickets : Types.Tickets,
        transactions : Types.Transactions,
        transactionId : Text,
        status : Types.TxStatus,
    ) : async Result.Result<Types.Transaction, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed");
        };

        switch (transactions.get(transactionId)) {
            case (null) {
                return #err("Transaction not found");
            };
            case (?transaction) {
                if (transaction.txStatus == #completed or transaction.txStatus == #failed) {
                    return #err("Transaction already processed");
                };

                let updatedTransaction : Types.Transaction = {
                    transaction with
                    txStatus = status;
                    updatedAt = ?Time.now();
                };

                transactions.put(transaction.id, updatedTransaction);

                switch (status) {
                    case (#completed) {
                        try {
                            // update event ticket owner balance
                            ignore UserService.updateUserBalance(users, transaction.to, transaction.amount, #add);

                            // update platform balance
                            ignore PlatformService.updatePlatformBalance(
                                platformBalance,
                                transaction.amount,
                                transaction.platformFee,
                                #add,
                            );

                            // create nft ticket
                            let eventId = switch (transaction.eventId) {
                                case (null) {
                                    throw Error.reject("Missing transaction eventId");
                                };
                                case (?eventId) { eventId };
                            };

                            let newTicketId = Utils.generateUUID(caller, transaction.id);

                            let newTicket : Types.Ticket = {
                                id = newTicketId;
                                owner = transaction.from;
                                eventId = eventId;
                                createdAt = Time.now();
                            };

                            tickets.put(newTicketId, newTicket);

                            return #ok(updatedTransaction);
                        } catch (error) {
                            let failedTx : Types.Transaction = {
                                transaction with
                                txStatus = #failed;
                            };
                            transactions.put(transaction.id, failedTx);
                            return #err("Failed to process transaction: " # Error.message(error));
                        };
                    };
                    case (#failed) {
                        return #ok(updatedTransaction);
                    };
                    case (#pending) {
                        return #err("Can't update to pending status");
                    }

                };
            };
        };
    };

    public func getTicketsBought(events : Types.Events, eventId : Text, tickets : Types.Tickets) : Result.Result<[Types.Ticket], Text> {
        switch (events.get(eventId)) {
            case (null) {
                return #err("Event not found");
            };
            case (?event) {
                let ticketsArray = Buffer.Buffer<Types.Ticket>(0);

                for ((_, ticket) in tickets.entries()) {
                    if (ticket.eventId == event.id) {
                        ticketsArray.add(ticket);
                    };
                };

                let sorted = Array.sort(
                    Buffer.toArray(ticketsArray),
                    func(a : Types.Ticket, b : Types.Ticket) : Order.Order {
                        Int.compare(b.createdAt, a.createdAt);
                    },
                );

                return #ok(sorted);
            };
        };
    };
};
