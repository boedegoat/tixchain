import Types "../types/Types";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Utils "../lib/Utils";
import TicketService "TicketService";

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
            resellMaxPricePercent;
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

        if (resellMaxPricePercent < 0 or resellMaxPricePercent > 200) {
            return #err("Resell max price percent can't over 200%");
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
            resellMaxPricePercent = resellMaxPricePercent;
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
                let { resellMaxPricePercent; description } = event;
                let { ticketPrice; totalTickets } = createResellEventData;

                let maxPrice = event.ticketPrice + event.ticketPrice * resellMaxPricePercent / 100;

                if (ticketPrice > maxPrice) {
                    return #err("Ticket price exceeds resell percentage limit of " # Nat.toText(resellMaxPricePercent) # "%");
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

    // public func updateEvent(
    //     caller : Principal,
    //     events : Types.Events,
    //     eventId : Text,
    //     updateEventData : Types.UpdateEventData,
    // ) : Result.Result<Types.Event, Text> {
    //     if (Principal.isAnonymous(caller)) {
    //         return #err("Anonymous principals are not allowed");
    //     };

    //     switch (events.get(eventId)) {
    //         case (null) {
    //             return #err("Event not found");
    //         };
    //         case (?event) {
    //             if (not Principal.equal(event.owner, caller)) {
    //                 return #err("Only the owner who can update this event");
    //             };

    //             let admins = switch (updateEventData.admins) {
    //                 case (null) {
    //                     event.admins;
    //                 };
    //                 case (?newAdmins) {
    //                     newAdmins;
    //                 };
    //             };

    //             let title = switch (updateEventData.title) {
    //                 case (null) {
    //                     event.title;
    //                 };
    //                 case (?newTitle) {
    //                     if (Text.size(newTitle) < 3 or Text.size(newTitle) > 100) {
    //                         return #err("Title must be between 3 and 100 characters");
    //                     };
    //                     newTitle;
    //                 };
    //             };

    //             let description = switch (updateEventData.description) {
    //                 case (null) {
    //                     event.description;
    //                 };
    //                 case (?newDescription) {
    //                     if (newDescription == "" or Text.size(newDescription) > 1000) {
    //                         return #err("Description must be between 1 and 1000 characters");
    //                     };
    //                     newDescription;
    //                 };
    //             };

    //             let date = switch (updateEventData.date) {
    //                 case (null) {
    //                     event.date;
    //                 };
    //                 case (?newDate) {
    //                     newDate;
    //                 };
    //             };

    //             let location = switch (updateEventData.location) {
    //                 case (null) {
    //                     event.location;
    //                 };
    //                 case (?newLocation) {
    //                     newLocation;
    //                 };
    //             };

    //             let updatedEvent : Types.Event = {
    //                 event with
    //                 admins = admins;
    //                 title = title;
    //                 description = description;
    //                 date = date;
    //                 location = location;
    //                 updatedAt = ?Time.now();
    //             };

    //             events.put(event.id, updatedEvent);
    //             return #ok(updatedEvent);
    //         };
    //     };
    // };

    public func deleteEvent(
        caller : Principal,
        events : Types.Events,
        eventId : Text,
    ) : Result.Result<(), Text> {
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
                // TODO: add logic for refunding tickets
                events.delete(eventId);
                return #ok(());
            };
        };
    };
};
