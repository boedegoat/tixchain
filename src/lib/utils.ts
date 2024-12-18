import { AccountIdentifier } from '@dfinity/ledger-icp'
import { Principal } from '@ic-reactor/react/dist/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator'

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
