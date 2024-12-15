import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Types "types/Types";
import UserService "services/UserService";
import EventService "services/EventService";

actor TixChain {
    private var users : Types.Users = HashMap.HashMap(0, Principal.equal, Principal.hash);
    private var events : Types.Events = HashMap.HashMap(0, Text.equal, Text.hash);

    private stable var usersEntries : [(Principal, Types.User)] = [];
    private stable var eventsEntries : [(Text, Types.Event)] = [];

    // PRE UPGRADE AND POST UPGRADE
    system func preupgrade() {
        usersEntries := Iter.toArray(users.entries());
        eventsEntries := Iter.toArray(events.entries());
    };

    system func postupgrade() {
        users := HashMap.fromIter(usersEntries.vals(), 0, Principal.equal, Principal.hash);
        events := HashMap.fromIter(eventsEntries.vals(), 0, Text.equal, Text.hash);
    };

    // USERS ENDPOINT
    public shared ({ caller }) func authenticateUser(username: Text, name: ?Text) : async Result.Result<Types.User, Text> {
        return UserService.authenticateUser(users, caller, username, name);
    };

    public shared ({ caller }) func updateUser(updateUserData: Types.UpdateUserData) : async Result.Result<Types.User, Text> {
        return UserService.updateUser(users, caller, updateUserData);
    };

    public shared ({ caller }) func whoami(): async ?Types.User {
        return users.get(caller);
    };

    // EVENTS ENDPOINT
    public shared ({ caller }) func createEvent(createEventData: Types.CreateEventData) : async Result.Result<Types.Event, Text> {
        return EventService.createEvent(events, caller, createEventData);
    };

    public shared ({ caller }) func updateEvent(eventId : Text, updateEventData: Types.UpdateEventData) : async Result.Result<Types.Event, Text> {
        return EventService.updateEvent(events, caller, eventId, updateEventData);
    };

    public shared ({ caller }) func deleteEvent(eventId : Text) : async Result.Result<(), Text> {
        return EventService.deleteEvent(events, caller, eventId);
    };

    public func getAllEvents() : async [Types.Event] {
        return Iter.toArray(events.vals());
    };

    public func getEvent(eventId : Text) : async ?Types.Event {
        return events.get(eventId);
    };
    
    // JUST FOR FUN FUNCTIONS :)
    public shared ({ caller }) func hi(name : Text) : async Text {
        var greetMsg = "hi " # name # " from blockchain 🔥";
        greetMsg #= " which have principal id of " # Principal.toText(caller);
        return greetMsg;
    };
};
