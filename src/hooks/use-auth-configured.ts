import { useUpdateCall } from '@/lib/actor'
import { generateImageFromUsername, generateUsernameFromId, getUserDepositAddress } from '@/lib/utils'
import { useAuth } from '@ic-reactor/react'
import { useRouter } from 'next/navigation'

export default function useAuthConfigured() {
	const router = useRouter()
	const { call: authenticateUser } = useUpdateCall({
		functionName: 'authenticateUser',
	})
	const { call: whoami } = useUpdateCall({
		functionName: 'whoami',
	})
	return useAuth({
		async onLoginSuccess(principal) {
			const username = generateUsernameFromId(principal.toText())
			const depositAddress = getUserDepositAddress(principal)
			const image = generateImageFromUsername(username)
			const result = await authenticateUser([username, depositAddress, image])
			if (result && 'ok' in result) {
				whoami()
				router.push('/home')
			}
		},
	})
}
