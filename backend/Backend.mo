import Principal "mo:base/Principal";

shared ({ caller = owner }) actor class Backend() {
    public shared ({ caller }) func hi(name : Text) : async Text {
        var greetMsg = "hi " # name # " from blockchain 🔥";
        greetMsg #= " which have principal id of " # Principal.toText(caller);
        return greetMsg;
    };
};
