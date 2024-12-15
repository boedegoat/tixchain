import { AccountIdentifier } from '@dfinity/ledger-icp'
import { Principal } from '@ic-reactor/react/dist/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getUserDepositAddress(principal: Principal) {
	return AccountIdentifier.fromPrincipal({
		principal,
		subAccount: undefined,
	}).toHex()
}
