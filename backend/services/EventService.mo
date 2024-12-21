import Types "../types/Types";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Order "mo:base/Order";
import Int "mo:base/Int";
import HashMap "mo:base/HashMap";
import Utils "../lib/Utils";
import TicketService "TicketService";
import PlatformService "PlatformService";
import UserService "UserService";

module EventService {
    public func getEvents(events : Types.Events) : Result.Result<[Types.Event], Text> {
        let eventsArray = Buffer.Buffer<Types.Event>(0);

        for (event in events.vals()) {
            eventsArray.add(event);
        };

        let sorted = Array.sort(
            Buffer.toArray(eventsArray),
            func(a : Types.Event, b : Types.Event) : Order.Order {
                Int.compare(b.createdAt, a.createdAt);
            },
        );

        return #ok(sorted);
    };

    public func getEventDetails(events : Types.Events, eventId : Text) : Result.Result<Types.Event, Text> {
        switch (events.get(eventId)) {
            case (null) {
                return #err("Event not found");
            };
            case (?event) {
                return #ok(event);
            };
        };
    };

    public func getMyEvents(caller : Principal, events : Types.Events, tickets : Types.Tickets) : Result.Result<[Types.MyEvent], Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed");
        };

        let ticketCounts = HashMap.HashMap<Text, Nat>(0, Text.equal, Text.hash);
        var eventsList = List.nil<Types.MyEvent>();

        // Count tickets per event
        for (ticket in tickets.vals()) {
            if (Principal.equal(ticket.owner, caller)) {
                let count = switch (ticketCounts.get(ticket.eventId)) {
                    case (null) { 1 };
                    case (?existing) { existing + 1 };
                };
                ticketCounts.put(ticket.eventId, count);
            };
        };

        // Create events list with counts
        for ((eventId, count) in ticketCounts.entries()) {
            switch (events.get(eventId)) {
                case (null) {
                    return #err("eventId not found");
                };
                case (?event) {
                    eventsList := List.push({ event with ownedTickets = count }, eventsList);
                };
            };
        };

        let sorted = Array.sort(
            List.toArray(eventsList),
            func(a : Types.MyEvent, b : Types.MyEvent) : Order.Order {
                Int.compare(b.createdAt, a.createdAt);
            },
        );

        return #ok(sorted);
    };

    public func createNewEvent(
        caller : Principal,
        events : Types.Events,
        createNewEventData : Types.CreateNewEventData,
    ) : Result.Result<Types.Event, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed");
        };

        let {
            title;
            description;
            date;
            location;
            ticketPrice;
            totalTickets;
            imageUrl;
            resellMaxPrice;
        } = createNewEventData;

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
            ticketPrice = ticketPrice;
            totalTickets = totalTickets;
            availableTickets = totalTickets;
            resellMaxPrice = resellMaxPrice;
            imageUrl = imageUrl;
            eventType = #new;
            originalEventId = null;
            createdAt = Time.now();
            updatedAt = null;
        };

        events.put(newEventId, newEvent);
        return #ok(newEvent);
    };

    public func createResellEvent(
        caller : Principal,
        events : Types.Events,
        tickets : Types.Tickets,
        createResellEventData : Types.CreateResellEventData,
    ) : Result.Result<Types.Event, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed");
        };

        let { eventId; ticketPrice; totalTickets } = createResellEventData;

        switch (events.get(eventId)) {
            case (null) {
                return #err("Event not found");
            };
            case (?event) {
                let { resellMaxPrice; description } = event;

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

                let newResellEventId = Utils.generateUUID(caller, description);

                let newResellEvent : Types.Event = {
                    event with
                    id = newResellEventId;
                    owner = caller;
                    ticketPrice = ticketPrice;
                    totalTickets = totalTickets;
                    availableTickets = totalTickets;
                    eventType = #resell;
                    originalEventId = ?event.id;
                    createdAt = Time.now();
                    updatedAt = null;
                };
                events.put(newResellEventId, newResellEvent);

                return #ok(newResellEvent);
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
        users : Types.Users,
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
                            ignore UserService.updateUserBalance(users, ticket.owner, event.ticketPrice, #add);
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
