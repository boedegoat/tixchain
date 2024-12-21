# TixChain

## Getting Started

1. `dfx start --clean --background`
1. `dfx deps pull`
1. `npm install`
1. `npm run setup`

## Starting Frontend Dev Server

Follows the same steps on the [Getting Started](#getting-started) section, then run:

```bash
npm run dev
```

## Redeploying Changes to the Internet Computer

After making changes to the backend, you can redeploy it by running:

```bash
npm run deploy:be
```

After making changes to the frontend, you can redeploy it by running:

```bash
npm run deploy:fe
```

Or you can deploy both at the same time by running:

```bash
npm run deploy
```

## Transfer ICP From Ledger to User Wallet

Check the balance of the ledger account:

```bash
dfx ledger balance $(dfx ledger account-id)
```

Transfer ICP from the ledger account to the user wallet:

```bash
dfx ledger transfer --amount AMOUNT_IN_ICP --memo 0 RECEIVER_ACCOUNT_ID
```

> **Note**
> RECEIVER_ACCOUNT_ID is basically the user deposit address
