import Types "../types/Types";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Utils "../lib/Utils";

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
            ticketPrice;
            totalTickets;
            imageUrl;
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

        let newEventId = Utils.generateUUID(caller, description);

        let newEvent : Types.Event = {
            id = newEventId;
            owner = caller;
            title = title;
            description = description;
            date = date;
            location = location;
            ticketPrice = ticketPrice;
            totalTickets = totalTickets;
            availableTickets = totalTickets;
            imageUrl = imageUrl;
            createdAt = Time.now();
            updatedAt = null;
        };

        events.put(newEventId, newEvent);
        return #ok(newEvent);
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

                let title = switch (updateEventData.title) {
                    case (null) {
                        event.title;
                    };
                    case (?newTitle) {
                        if (Text.size(newTitle) < 3 or Text.size(newTitle) > 100) {
                            return #err("Title must be between 3 and 100 characters");
                        };
                        newTitle;
                    };
                };

                let description = switch (updateEventData.description) {
                    case (null) {
                        event.description;
                    };
                    case (?newDescription) {
                        if (newDescription == "" or Text.size(newDescription) > 1000) {
                            return #err("Description must be between 1 and 1000 characters");
                        };
                        newDescription;
                    };
                };

                let date = switch (updateEventData.date) {
                    case (null) {
                        event.date;
                    };
                    case (?newDate) {
                        newDate;
                    };
                };

                let location = switch (updateEventData.location) {
                    case (null) {
                        event.location;
                    };
                    case (?newLocation) {
                        newLocation;
                    };
                };

                let updatedEvent : Types.Event = {
                    event with
                    title = title;
                    description = description;
                    date = date;
                    location = location;
                    updatedAt = ?Time.now();
                };

                events.put(event.id, updatedEvent);
                return #ok(updatedEvent);
            };
        };
    };

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
