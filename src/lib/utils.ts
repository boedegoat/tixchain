import { AccountIdentifier, LedgerCanister } from '@dfinity/ledger-icp'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator'
import { HttpAgent, Identity } from '@dfinity/agent'
import { AuthClient } from '@dfinity/auth-client'
import { Principal } from '@dfinity/principal'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getUserDepositAddress(principal: Principal) {
	return AccountIdentifier.fromPrincipal({
		principal,
		subAccount: undefined,
	}).toHex()
}

export function generateUsernameFromId(id: string) {
	return (
		'@' +
		uniqueNamesGenerator({
			dictionaries: [colors, animals],
			seed: id,
			separator: '-',
			length: 2,
		})
	)
}

export function generateImageFromUsername(username: string) {
	return `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${username}`
}

export function convertE8sToICP(e8s: bigint) {
	return Number(e8s) / 10 ** 8
}

export function convertICPToE8s(icp: number) {
	return BigInt(icp * 10 ** 8)
}

export async function transferICPToBackendCanister(
	identity: Identity,
	amount: bigint // Amount in e8s (1 ICP = 100,000,000 e8s)
) {
	try {
		const agent = await HttpAgent.create({
			identity,
			shouldFetchRootKey: true,
			verifyQuerySignatures: false,
			host: 'http://localhost:4943',
		})

		// Create a Ledger Canister instance
		const ledger = LedgerCanister.create({
			agent: agent,
			canisterId: Principal.fromText('ryjl3-tyaaa-aaaaa-aaaba-cai'), // Ledger Canister ID
		})

		const accountIdentifier = AccountIdentifier.fromPrincipal({
			principal: Principal.fromText(process.env.NEXT_PUBLIC_CANISTER_ID_BACKEND!),
			subAccount: undefined,
		})

		const transactionFee = await ledger.transactionFee()

		if (!transactionFee) {
			throw new Error('Failed to get transaction fee')
		}

		// Perform the transfer
		const transferResult = await ledger.transfer({
			to: accountIdentifier,
			amount: amount,
			fee: transactionFee,
			memo: BigInt(0), // Optional memo field
			fromSubAccount: undefined,
		})

		console.log('Transfer result:', transferResult)
		return transferResult
	} catch (error) {
		console.error('Transfer failed:', error)
		throw error
	}
}

export function truncateAddress(address: string) {
	if (address.length <= 12) return address
	return `${address.slice(0, 6)}...${address.slice(-6)}`
}
