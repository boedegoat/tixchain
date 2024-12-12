actor Backend {
    public query func hi(name : Text) : async Text {
        return "hi " # name # " from blockchain 🔥";
    };
};
