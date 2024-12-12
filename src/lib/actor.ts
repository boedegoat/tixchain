import { createReactor } from '@ic-reactor/react'
import { backend, idlFactory } from '@/declarations/backend'

export type Backend = typeof backend

const canisterId = process.env.NEXT_PUBLIC_CANISTER_ID_BACKEND

if (!canisterId) {
	throw new Error('Missing NEXT_PUBLIC_CANISTER_ID_BACKEND')
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const { useActorStore, useAuth, useQueryCall } = createReactor<Backend>({
	canisterId,
	idlFactory,
	host: 'http://localhost:4943',
})

import { createActor } from '@/declarations/backend'

export const actor = createActor(canisterId, {
	agentOptions: {
		host: 'http://localhost:4943',
	},
})
