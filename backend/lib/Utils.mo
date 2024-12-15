import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Time "mo:base/Time";

module Utils {
    public func generateUUID(userPrincipal : Principal, content : Text) : Text {
        let principalText = Principal.toText(userPrincipal);
        let timestamp = Int.toText(Time.now());
        let contentHash = Nat32.toText(Text.hash(content));

        let combined = principalText # timestamp # contentHash;
        let finalHash = Text.hash(combined);
        return Nat32.toText(finalHash);
    };

    // calculate 5% platform fee
    public func calculatePlatformFee(amount : Nat) : Nat {
        return (amount * 5) / 100;
    };
};
