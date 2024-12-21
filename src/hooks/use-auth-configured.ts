import { useUpdateCall } from '@/lib/actor'
import { generateImageFromUsername, generateUsernameFromId, getUserDepositAddress } from '@/lib/utils'
import { useAuth } from '@ic-reactor/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function useAuthConfigured() {
	const router = useRouter()
	const { call: authenticateUser } = useUpdateCall({
		functionName: 'authenticateUser',
	})
	const useAuthReturn = useAuth({
		async onLoginSuccess(principal) {
			const username = generateUsernameFromId(principal.toText())
			const depositAddress = getUserDepositAddress(principal)
			const image = generateImageFromUsername(username)
			const result = await authenticateUser([username, depositAddress, image])
			if (result && 'ok' in result) {
				router.push('/home')
			}
		},
	})
	const [depositAddress, setDepositAddress] = useState('')

	const { identity } = useAuthReturn

	useEffect(() => {
		if (!identity) {
			return
		}
		setDepositAddress(getUserDepositAddress(identity.getPrincipal()))
	}, [identity])

	return { ...useAuthReturn, depositAddress }
}
