#!/bin/bash

npm run deploy:deps
npm run deploy:ledger
npm run deploy:be


# Check if NEXT_PUBLIC_CANISTER_ID_BACKEND already exists in .env
if ! grep -q "NEXT_PUBLIC_CANISTER_ID_BACKEND" .env; then
    CANISTER_ID_BACKEND=$(dfx canister id backend)
    echo "" >> .env
    echo "NEXT_PUBLIC_CANISTER_ID_BACKEND='$CANISTER_ID_BACKEND'" >> .env
fi