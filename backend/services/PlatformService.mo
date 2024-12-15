import Types "../types/Types";
import Result "mo:base/Result";
import Nat "mo:base/Nat";

module PlatformService {
    public func updatePlatformBalance(
        platformBalance : Types.PlatformBalance,
        total : Nat,
        platformFee : Nat,
        updateType : { #add; #sub },
    ) : Result.Result<(), Text> {
        if (updateType == #add) {
            // Normal operation
            let newBalance = platformBalance.balance + total;
            let newTotalFees = platformBalance.totalFees + platformFee;

            // Check for overflow
            if (
                newBalance < platformBalance.balance or
                newTotalFees < platformBalance.totalFees
            ) {
                return #err("Overflow detected");
            };

            platformBalance.balance := newBalance;
            platformBalance.totalFees := newTotalFees;
        } else if (updateType == #sub) {
            let newBalance = Nat.sub(platformBalance.balance, total);
            let newTotalFees = Nat.sub(platformBalance.totalFees, platformFee);

            // Check for underflow
            if (
                newBalance > platformBalance.balance or
                newTotalFees > platformBalance.totalFees
            ) {
                return #err("Underflow detected during substaction");
            };

            platformBalance.balance := newBalance;
            platformBalance.totalFees := newTotalFees;
        };

        #ok();
    };
};
