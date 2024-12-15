import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";

module Types {
    // USER TYPES
    public type Users = HashMap.HashMap<Principal, User>;
    public type User = {
        id : Principal;
        username : Text;
        name : ?Text;
        balance : Nat;
        depositAddress : Text;
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
        title : Text;
        description : Text;
        date : Text;
        location : Text;
        ticketPrice : Nat;
        totalTickets : Nat;
        availableTickets : Nat;
        imageUrl : ?Text;
        createdAt : Int;
        updatedAt : ?Int;
    };
    public type CreateEventData = {
        title : Text;
        description : Text;
        date : Text;
        location : Text;
        ticketPrice : Nat;
        totalTickets : Nat;
        imageUrl : ?Text;
    };
    public type UpdateEventData = {
        title : ?Text;
        description : ?Text;
        date : ?Text;
        location : ?Text;
        imageUrl : ?Text;
    };

    // NFT TICKET TYPES
    public type Tickets = HashMap.HashMap<Text, Ticket>;
    public type Ticket = {
        id : Text;
        owner : Principal;
        eventId : Text;
        createdAt : Int;
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
        #buyTicket;
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
