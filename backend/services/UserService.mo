import Types "../types/Types";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

module UserService {
    public func authenticateUser(
        users : Types.Users,
        userId : Principal,
        username : Text,
        name : ?Text,
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
                    name = name;
                    createdAt = Time.now();
                    updatedAt = null;
                };

                users.put(userId, newUser);

                #ok(newUser);
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

                let updatedUser : Types.User = {
                    user with
                    username = username;
                    name = name;
                    updatedAt = ?Time.now();
                };

                users.put(userId, updatedUser);
                #ok(updatedUser);
            };
        };
    };
};
