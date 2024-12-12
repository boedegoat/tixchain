import Principal "mo:base/Principal";

actor Backend {
    public shared ({ caller }) func hi(name : Text) : async Text {
        var greetMsg = "hi " # name # " from blockchain 🔥";
        greetMsg #= " which have principal id of " # Principal.toText(caller);
        return greetMsg;
    };

    public shared ({ caller }) func whoami() : async Text {
        return Principal.toText(caller);
    };
};
