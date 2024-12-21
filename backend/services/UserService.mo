import Types "../types/Types";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import ledger "canister:icp_ledger_canister";

module UserService {
    public func authenticateUser(
        users : Types.Users,
        userId : Principal,
        username : Text,
        depositAddress : Text,
        imageUrl : Text,
    ) : Result.Result<Types.User, Text> {
        if (Text.size(username) < 3 or Text.size(username) > 20) {
            return #err("Username must be between 3 and 20 characters");
        };

        if (Principal.isAnonymous(userId)) {
            return #err("Anonymous principals are not allowed");
        };

        for ((id, user) in users.entries()) {
            if (user.username == username and id != userId) {
                return #err("The username " # username # " is already in use");
            };
        };

        switch (users.get(userId)) {
            case (?existingUser) {
                return #ok(existingUser);
            };
            case (null) {
                let newUser : Types.User = {
                    id = userId;
                    username = username;
                    name = ?username;
                    balance = 0;
                    depositAddress = depositAddress;
                    imageUrl = imageUrl;
                    createdAt = Time.now();
                    updatedAt = null;
                };

                users.put(userId, newUser);

                #ok(newUser);
            };
        };
    };

    public func getUsernameById(users : Types.Users, id : Principal) : Result.Result<Text, Text> {
        switch (users.get(id)) {
            case (null) {
                return #err("User id not found");
            };
            case (?user) {
                return #ok(user.username);
            };
        };
    };

    public func updateUser(
        users : Types.Users,
        userId : Principal,
        updateUserData : Types.UpdateUserData,
    ) : Result.Result<Types.User, Text> {
        if (Principal.isAnonymous(userId)) {
            return #err("Anonymous principals are not allowed");
        };

        switch (users.get(userId)) {
            case (null) {
                return #err("User not found");
            };
            case (?user) {
                let username = switch (updateUserData.username) {
                    case (null) {
                        user.username;
                    };
                    case (?newUsername) {
                        if (Text.size(newUsername) < 3 or Text.size(newUsername) > 20) {
                            return #err("Username must be between 3 and 20 characters");
                        };

                        if (newUsername != user.username) {
                            for ((id, existingUser) in users.entries()) {
                                if (id != userId and Text.equal(existingUser.username, newUsername)) {
                                    return #err("The username '" # newUsername # "' is already in use.");
                                };
                            };
                        };
                        newUsername;
                    };
                };

                let name = switch (updateUserData.name) {
                    case (null) {
                        user.name;
                    };
                    case (?newName) {
                        ?newName;
                    };
                };

                let depositAddress = switch (updateUserData.depositAddress) {
                    case (null) {
                        user.depositAddress;
                    };
                    case (?newDepositAddress) {
                        newDepositAddress;
                    };
                };

                let updatedUser : Types.User = {
                    user with
                    username = username;
                    name = name;
                    depositAddress = depositAddress;
                    updatedAt = ?Time.now();
                };

                users.put(userId, updatedUser);
                return #ok(updatedUser);
            };
        };
    };

    public func getLedgerBalance(principalId : Principal) : async Nat {
        let balance = await ledger.icrc1_balance_of({
            owner = principalId;
            subaccount = null;
        });
        return balance;
    };

    public func getAppBalance(users : Types.Users, caller : Principal) : Nat {
        switch (users.get(caller)) {
            case (null) {
                return 0;
            };
            case (?user) {
                return user.balance;
            };
        };
    };

    public func updateUserBalance(
        users : Types.Users,
        userId : Principal,
        amount : Nat,
        updateType : { #add; #sub },
    ) : Result.Result<(), Text> {
        let currentUser = users.get(userId);

        switch (currentUser, updateType) {
            case (null, _) {
                return #err("User not found");
            };
            case (?user, #sub) {
                if (user.balance < amount) {
                    return #err("Insufficient balance");
                };

                let updatedUser = {
                    user with
                    balance = Nat.sub(user.balance, amount);
                };

                users.put(userId, updatedUser);
                // Log the withdrawal event
                return #ok();

            };
            case (?user, #add) {
                let updatedUser = {
                    user with
                    balance = Nat.add(user.balance, amount);
                };
                users.put(userId, updatedUser);
                return #ok();
            };
        };
    };
};
