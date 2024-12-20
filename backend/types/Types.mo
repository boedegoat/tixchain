import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import List "mo:base/List";

module Types {
    // USER TYPES
    public type Users = HashMap.HashMap<Principal, User>;
    public type User = {
        id : Principal;
        username : Text;
        name : ?Text;
        balance : Nat;
        depositAddress : Text;
        imageUrl : Text;
        createdAt : Int;
        updatedAt : ?Int;
    };
    public type UpdateUserData = {
        username : ?Text;
        name : ?Text;
        depositAddress : ?Text;
    };

    // EVENT TYPES
    public type Events = HashMap.HashMap<Text, Event>;
    public type Event = {
        id : Text;
        owner : Principal;
        admins : List.List<Principal>;
        title : Text;
        description : Text;
        date : Text;
        startsAt : Int;
        endsAt : ?Int;
        location : Text;
        ticketPrice : Nat;
        totalTickets : Nat;
        availableTickets : Nat;
        resellMaxPrice : Nat;
        imageUrl : ?Text;
        eventType : EventType;
        originalEventId : ?Text;
        createdAt : Int;
        updatedAt : ?Int;
    };
    public type EventType = {
        #new;
        #resell;
    };
    public type ReselledEvents = HashMap.HashMap<Text, ReselledEvent>;
    public type ReselledEvent = {
        id : Text;
        eventId : Text;
        owner : Principal;
        ticketPrice : Nat;
        totalTickets : Nat;
        availableTickets : Nat;
        createdAt : Int;
        updatedAt : ?Int;
    };
    public type CreateNewEventData = {
        title : Text;
        description : Text;
        date : Text;
        startsAt : Int;
        endsAt : ?Int;
        location : Text;
        ticketPrice : Nat;
        totalTickets : Nat;
        resellMaxPrice : Nat;
        imageUrl : ?Text;
    };
    public type UpdateEventData = {
        admins : ?List.List<Principal>;
        imageUrl : ?Text;
    };
    public type CreateResellEventData = {
        eventId : Text;
        ticketPrice : Nat;
        totalTickets : Nat;
    };

    // NFT TICKET TYPES
    public type Tickets = HashMap.HashMap<Text, Ticket>;
    public type Ticket = {
        id : Text;
        owner : Principal;
        eventId : Text;
        isUsed : Bool;
        createdAt : Int;
        updatedAt : ?Int;
    };
    public type TicketSignatures = HashMap.HashMap<Text, TicketSignature>;
    public type TicketSignature = {
        signature : Text;
        ticketId : Text;
        expiresAt : Int;
    };

    // TRANSACTION TYPES
    public type Transactions = HashMap.HashMap<Text, Transaction>;
    public type Transaction = {
        id : Text;
        from : Principal;
        to : Principal;
        amount : Nat;
        transactionType : TransactionType;
        txStatus : TxStatus;
        eventId : ?Text;
        platformFee : Nat;
        createdAt : Int;
        updatedAt : ?Int;
    };
    public type TransactionType = {
        #buyNewTicket;
        #buyResellTicket;
        #withdrawal;
    };
    public type TxStatus = {
        #pending;
        #completed;
        #failed;
    };

    // PLATFORM TYPES
    public type PlatformBalance = {
        var balance : Nat;
        var totalFees : Nat;
    };
};
