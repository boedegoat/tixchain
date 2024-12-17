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
import List "mo:base/List";
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
        events : Types.Events,
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

                let eventId = switch (transaction.eventId) {
                    case (null) {
                        return #err("Missing transaction eventId");
                    };
                    case (?eventId) { eventId };
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
                            let newTicketId = Utils.generateUUID(caller, transaction.id);

                            let newTicket : Types.Ticket = {
                                id = newTicketId;
                                owner = transaction.from;
                                eventId = eventId;
                                isUsed = false;
                                createdAt = Time.now();
                                updatedAt = null;
                            };

                            tickets.put(newTicketId, newTicket);

                            // update event availableTicket
                            switch (events.get(eventId)) {
                                case (null) {};
                                case (?event) {
                                    events.put(eventId, { event with availableTickets = Nat.sub(event.availableTickets, 1) });
                                };
                            };

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
                    };
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

    public func getMyTickets(caller : Principal, tickets : Types.Tickets) : Result.Result<[Types.Ticket], Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed");
        };

        let ticketsArray = Buffer.Buffer<Types.Ticket>(0);

        for ((_, ticket) in tickets.entries()) {
            if (Principal.equal(ticket.owner, caller)) {
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

    public func getMyTicketsByEventId(
        caller : Principal,
        tickets : Types.Tickets,
        events : Types.Events,
        eventId : Text,
    ) : Result.Result<[Types.Ticket], Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed");
        };

        switch (events.get(eventId)) {
            case (null) {
                return #err("Event not found");
            };
            case (?event) {
                let ticketsArray = Buffer.Buffer<Types.Ticket>(0);

                for ((_, ticket) in tickets.entries()) {
                    if (Principal.equal(ticket.owner, caller) and ticket.eventId == event.id) {
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

    public func useTicket(
        caller : Principal,
        events : Types.Events,
        tickets : Types.Tickets,
        ticketId : Text,
        ticketSignatures : Types.TicketSignatures,
    ) : Result.Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed");
        };

        switch (tickets.get(ticketId)) {
            case (null) {
                return #err("Ticket not found");
            };
            case (?ticket) {
                if (ticket.isUsed) {
                    return #err("Ticket already used");
                };

                if (not Principal.equal(ticket.owner, caller)) {
                    return #err("Only the owner who can use this ticket");
                };

                let eventId = ticket.eventId;

                // check is event exist
                switch (events.get(eventId)) {
                    case (null) {
                        return #err("Event Id not exist");
                    };
                    case _ {
                        // create ticket signature
                        let signature = Utils.generateUUID(caller, ticket.id # eventId);
                        let newTicketSignature : Types.TicketSignature = {
                            signature = signature;
                            ticketId = ticket.id;
                            expiresAt = Time.now() + 60_000_000_000; // expires after 1 minute
                        };

                        ticketSignatures.put(signature, newTicketSignature);
                        return #ok(signature);
                    };
                };
            };
        };
    };

    public func scanTicketSignature(
        caller : Principal,
        events : Types.Events,
        eventId : Text,
        tickets : Types.Tickets,
        ticketSignatures : Types.TicketSignatures,
        ticketSignature : Text,
    ) : Result.Result<(), Text> {
        switch (events.get(eventId)) {
            case (null) {
                return #err("Event not found");
            };
            case (?event) {
                let isAdmin = switch (List.find<Principal>(event.admins, func admin { Principal.equal(admin, caller) })) {
                    case (null) false;
                    case _ true;
                };

                // if not owner and not admin
                if (not Principal.equal(event.owner, caller) and not isAdmin) {
                    return #err("Only event owner or admin who can scan ticket");
                };

                switch (ticketSignatures.get(ticketSignature)) {
                    case (null) {
                        return #err("Invalid ticket signature");
                    };
                    case (?signature) {
                        let { ticketId } = signature;

                        if (Time.now() > signature.expiresAt) {
                            return #err("Ticket signature already expired, please regenerate new");
                        };

                        switch (tickets.get(ticketId)) {
                            case (null) {
                                return #err("Ticket not found");
                            };
                            case (?ticket) {
                                // update ticket isUsed
                                let updatedTicket : Types.Ticket = {
                                    ticket with
                                    isUsed = true;
                                    updatedAt = ?Time.now();
                                };
                                tickets.put(ticket.id, updatedTicket);

                                // delete ticket signature after valid use
                                ticketSignatures.delete(ticketSignature);

                                return #ok();
                            };
                        };

                    };
                };
            };
        };
    };
};
