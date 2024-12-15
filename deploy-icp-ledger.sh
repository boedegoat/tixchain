#!/bin/bash

# Create a new identity for minting
# Check if minter identity exists, if not create it
if ! dfx identity use minter &>/dev/null; then
    echo "Creating new minter identity..."
    dfx identity new minter
else
    echo "Minter identity already exists, using it..."
fi

dfx identity use minter
MINTER_ACCOUNT_ID=$(dfx ledger account-id)

# Switch back to default identity
dfx identity use default
DEFAULT_ACCOUNT_ID=$(dfx ledger account-id)

# Deploy the ICP ledger canister
dfx deploy --specified-id ryjl3-tyaaa-aaaaa-aaaba-cai icp_ledger_canister --argument "
  (variant {
    Init = record {
      minting_account = \"$MINTER_ACCOUNT_ID\";
      initial_values = vec {
        record {
          \"$DEFAULT_ACCOUNT_ID\";
          record {
            e8s = 10_000_000_000 : nat64;
          };
        };
      };
      send_whitelist = vec {};
      transfer_fee = opt record {
        e8s = 10_000 : nat64;
      };
      token_symbol = opt \"LICP\";
      token_name = opt \"Local ICP\";
    }
  })
"

echo "ICP Ledger deployed successfully!"