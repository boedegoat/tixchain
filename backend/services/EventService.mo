import Types "../types/Types";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Utils "../lib/Utils";
import TicketService "TicketService";
import TransactionService "TransactionService";
import PlatformService "PlatformService";

module EventService {
    public func createEvent(
        caller : Principal,
        events : Types.Events,
        createEventData : Types.CreateEventData,
    ) : Result.Result<Types.Event, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed");
        };

        let {
            title;
            description;
            date;
            location;
            startsAt;
            endsAt;
            ticketPrice;
            totalTickets;
            imageUrl;
            resellMaxPrice;
        } = createEventData;

        if (Text.size(title) < 3 or Text.size(title) > 100) {
            return #err("Title must be between 3 and 100 characters");
        };

        if (description == "" or Text.size(description) > 1000) {
            return #err("Description must be between 1 and 1000 characters");
        };

        if (ticketPrice < 0) {
            return #err("Ticket price can't be negative");
        };

        if (totalTickets < 0) {
            return #err("Total tickets can't be negative");
        };

        if (resellMaxPrice < ticketPrice) {
            return #err("Resell max price can't lower than ticket price");
        };

        let newEventId = Utils.generateUUID(caller, description);

        let newEvent : Types.Event = {
            id = newEventId;
            owner = caller;
            admins = List.nil<Principal>();
            title = title;
            description = description;
            date = date;
            location = location;
            startsAt = startsAt;
            endsAt = endsAt;
            ticketPrice = ticketPrice;
            totalTickets = totalTickets;
            availableTickets = totalTickets;
            resellMaxPrice = resellMaxPrice;
            imageUrl = imageUrl;
            createdAt = Time.now();
            updatedAt = null;
        };

        events.put(newEventId, newEvent);
        return #ok(newEvent);
    };

    public func createReselledEvent(
        caller : Principal,
        tickets : Types.Tickets,
        events : Types.Events,
        eventId : Text,
        reselledEvents : Types.ReselledEvents,
        createResellEventData : Types.CreateResellEventData,
    ) : Result.Result<Types.ReselledEvent, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed");
        };

        switch (events.get(eventId)) {
            case (null) {
                return #err("Event not found");
            };
            case (?event) {
                let { resellMaxPrice; description } = event;
                let { ticketPrice; totalTickets } = createResellEventData;

                if (ticketPrice > resellMaxPrice) {
                    return #err("Ticket price exceeds resell max price limit of " # Nat.toText(resellMaxPrice));
                };

                switch (TicketService.getMyTicketsByEventId(caller, tickets, events, eventId)) {
                    case (#err(msg)) {
                        return #err(msg);
                    };
                    case (#ok(userTickets)) {
                        if (totalTickets > userTickets.size()) {
                            return #err("Total tickets can't be more than owned tickets");
                        };
                    };
                };

                let newReselledEventId = Utils.generateUUID(caller, description);
                let newReselledEvent : Types.ReselledEvent = {
                    id = newReselledEventId;
                    owner = caller;
                    eventId = eventId;
                    ticketPrice = ticketPrice;
                    totalTickets = totalTickets;
                    availableTickets = totalTickets;
                    createdAt = Time.now();
                    updatedAt = null;
                };

                reselledEvents.put(newReselledEventId, newReselledEvent);
                return #ok(newReselledEvent);
            };
        };

    };

    public func updateEvent(
        caller : Principal,
        events : Types.Events,
        eventId : Text,
        updateEventData : Types.UpdateEventData,
    ) : Result.Result<Types.Event, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed");
        };

        switch (events.get(eventId)) {
            case (null) {
                return #err("Event not found");
            };
            case (?event) {
                if (not Principal.equal(event.owner, caller)) {
                    return #err("Only the owner who can update this event");
                };

                let admins = switch (updateEventData.admins) {
                    case (null) {
                        event.admins;
                    };
                    case (?newAdmins) {
                        newAdmins;
                    };
                };

                let imageUrl = switch (updateEventData.imageUrl) {
                    case (null) {
                        event.imageUrl;
                    };
                    case (?newImageUrl) {
                        ?newImageUrl;
                    };
                };

                let updatedEvent : Types.Event = {
                    event with
                    admins = admins;
                    imageUrl = imageUrl;
                    updatedAt = ?Time.now();
                };

                events.put(event.id, updatedEvent);
                return #ok(updatedEvent);
            };
        };
    };

    public func deleteEvent(
        caller : Principal,
        platformBalance : Types.PlatformBalance,
        tickets : Types.Tickets,
        events : Types.Events,
        eventId : Text,
    ) : async Result.Result<(), Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed");
        };

        switch (events.get(eventId)) {
            case (null) {
                return #err("Event not found");
            };
            case (?event) {
                if (not Principal.equal(event.owner, caller)) {
                    return #err("Only the owner who can update this event");
                };

                switch (TicketService.getTicketsBought(events, eventId, tickets)) {
                    case (#err(msg)) {
                        return #err(msg);
                    };
                    case (#ok(eventTickets)) {
                        let platformFee = Utils.calculatePlatformFee(event.ticketPrice);
                        for (ticket in eventTickets.vals()) {
                            ignore await TransactionService.transfer(Nat64.fromNat(event.ticketPrice), ticket.owner);
                            ignore PlatformService.updatePlatformBalance(platformBalance, Nat.sub(event.ticketPrice, platformFee), platformFee, #sub);
                        };
                        events.delete(eventId);
                        return #ok(());
                    };
                };
            };
        };
    };
};
