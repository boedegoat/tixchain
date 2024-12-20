import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Time "mo:base/Time";
import Nat64 "mo:base/Nat64";
import IcpLedger "canister:icp_ledger_canister";
import Types "../types/Types";
import Utils "../lib/Utils";
import UserService "UserService";
import PlatformService "PlatformService";

module TransactionService {
    public func transfer(amount : Nat64, to : Principal) : async Result.Result<IcpLedger.BlockIndex, Text> {
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

    public func withdraw(
        transactions : Types.Transactions,
        platformBalance : Types.PlatformBalance,
        users : Types.Users,
        userId : Principal,
        amount : Nat,
    ) : async Result.Result<Types.Transaction, Text> {
        // Validate amount
        if (amount == 0) {
            return #err("Withdrawal amount must be greater than 0");
        };

        // Check minimum withdrawal amount (e.g., 0.01 ICP = 10_000 e8s)
        if (amount < 10_000) {
            return #err("Withdrawal amount must be at least 0.01 ICP");
        };

        // Check maximum withdrawal amount
        let maxWithdrawal : Nat = 1_000_000_000_000; // 10,000 ICP
        if (amount > maxWithdrawal) {
            return #err("Withdrawal amount exceeds maximum limit");
        };

        // Check if user has any pending withdrawals
        for ((_, tx) in transactions.entries()) {
            if (tx.from == userId and tx.transactionType == #withdrawal and tx.txStatus == #pending) {
                return #err("User has a pending withdrawal");
            };
        };

        switch (users.get(userId)) {
            case (null) { #err("User has no balance") };
            case (?user) {
                let totalAmount = amount + 10_000;
                if (user.balance < totalAmount) {
                    return #err("Insufficient balance (including transaction fees)");
                };

                let txId = Utils.generateUUID(userId, "withdrawal");
                let withdrawalTx : Types.Transaction = {
                    id = txId;
                    from = userId;
                    to = userId;
                    amount = amount;
                    transactionType = #withdrawal;
                    txStatus = #pending;
                    eventId = null;
                    platformFee = 0;
                    createdAt = Time.now();
                    updatedAt = null;
                };

                transactions.put(txId, withdrawalTx);

                try {
                    // First update the balances before making the transfer
                    // This ensures we don't transfer funds if balance updates fail

                    // 1. Update user balance
                    let balanceResult = UserService.updateUserBalance(
                        users,
                        userId,
                        totalAmount,
                        #sub,
                    );

                    switch (balanceResult) {
                        case (#err(e)) {
                            // If balance update fails, mark transaction as failed
                            let failedTx = {
                                withdrawalTx with
                                txStatus = #failed;
                            };
                            transactions.put(txId, failedTx);
                            return #err("Failed to update user balance: " # e);
                        };
                        case (#ok()) {
                            // 2. Substract from platform balance
                            let platformBalanceResult = PlatformService.updatePlatformBalance(
                                platformBalance,
                                totalAmount,
                                0,
                                #sub,
                            );

                            switch (platformBalanceResult) {
                                case (#err(e)) {
                                    // If platform balance update fails, revert user balance
                                    ignore UserService.updateUserBalance(
                                        users,
                                        userId,
                                        totalAmount,
                                        #add,
                                    );

                                    let failedTx = {
                                        withdrawalTx with
                                        txStatus = #failed;
                                    };
                                    transactions.put(txId, failedTx);
                                    return #err("Failed to update platform balance: " # e);
                                };
                                case (#ok()) {
                                    // 3. Only proceed with transfer after all balance updates are successful
                                    let transferResult = await transfer(Nat64.fromNat(amount), userId);

                                    switch (transferResult) {
                                        case (#ok(_blockIndex)) {
                                            // Transfer successful, update transaction status
                                            let completedTx = {
                                                withdrawalTx with
                                                txStatus = #completed;
                                            };
                                            transactions.put(txId, completedTx);
                                            Debug.print(debug_show (transferResult));
                                            #ok(completedTx);
                                        };
                                        case (#err(e)) {
                                            // Transfer failed, need to rollback all balance changes

                                            // Rollback user balance
                                            ignore UserService.updateUserBalance(
                                                users,
                                                userId,
                                                totalAmount,
                                                #add,
                                            );

                                            // Rollback platform balance (add back the balance)
                                            ignore PlatformService.updatePlatformBalance(
                                                platformBalance,
                                                totalAmount,
                                                0,
                                                #add,
                                            );

                                            let failedTx = {
                                                withdrawalTx with
                                                txStatus = #failed;
                                            };
                                            transactions.put(txId, failedTx);
                                            #err("Transfer failed, changes rolled back: " # e);
                                        };
                                    };
                                };
                            };
                        };
                    };
                } catch (e) {
                    // For unexpected errors, attempt to rollback any changes
                    ignore UserService.updateUserBalance(
                        users,
                        userId,
                        totalAmount,
                        #add,
                    );

                    ignore PlatformService.updatePlatformBalance(
                        platformBalance,
                        totalAmount,
                        0,
                        #add,
                    );

                    let failedTx = {
                        withdrawalTx with
                        txStatus = #failed;
                    };
                    transactions.put(txId, failedTx);
                    #err("Unexpected error, changes rolled back: " # Error.message(e));
                };
            };
        };

    };
};
