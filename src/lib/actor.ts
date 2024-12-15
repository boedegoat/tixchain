import { createActorContext } from '@ic-reactor/react'
import { backend, idlFactory } from '@/declarations/backend'

export type Backend = typeof backend

const canisterId = process.env.NEXT_PUBLIC_CANISTER_ID_BACKEND

if (!canisterId) {
	throw new Error('Missing NEXT_PUBLIC_CANISTER_ID_BACKEND')
}

export const {
	useQueryCall,
	useUpdateCall,
	ActorProvider: ICPActorProvider,
} = createActorContext<Backend>({
	canisterId,
	idlFactory,
})
