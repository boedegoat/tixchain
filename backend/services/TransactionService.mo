import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import IcpLedger "canister:icp_ledger_canister";

module TransactionService {
    private func transfer(amount : Nat64, to : Principal) : async Result.Result<IcpLedger.BlockIndex, Text> {
        try {
            let accountIdentifier = await IcpLedger.account_identifier({
                owner = to;
                subaccount = null;
            });

            let transferArgs : IcpLedger.TransferArgs = {
                to = accountIdentifier;
                memo = 0;
                amount = { e8s = amount };
                fee = { e8s = 10_000 };
                from_subaccount = null;
                created_at_time = null;
            };

            Debug.print(debug_show ({ e8s = amount }));
            Debug.print(debug_show (accountIdentifier));

            let transferResult = await IcpLedger.transfer(transferArgs);
            switch (transferResult) {
                case (#Err(transferError)) {
                    return #err("Couldn't transfer funds: " # debug_show (transferError));
                };
                case (#Ok(blockIndex)) { return #ok(blockIndex) };
            };
        } catch (error : Error) {
            return #err("Reject message: " # Error.message(error));
        };
    };
};
