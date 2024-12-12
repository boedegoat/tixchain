# Next.js ICP Template

## Starting Local Server

1. `dfx start --clean`
2. `dfx generate backend`
3. setup `.env`, add `NEXT_PUBLIC_CANISTER_ID_BACKEND` set it to match `CANISTER_ID_BACKEND`
4. `npm i && npm run build`
5. `dfx deploy`

## Starting Frontend Dev Server

Follows the same steps as above, then run:

```bash
npm run dev
```
