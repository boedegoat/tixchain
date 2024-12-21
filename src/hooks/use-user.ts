import { useQueryCall } from '@/lib/actor'
import { useEffect } from 'react'

export default function useUser() {
	const whoamiReturn = useQueryCall({
		functionName: 'whoami',
		refetchOnMount: true,
	})

	const { data, loading: userLoading, refetch, ...restWhoamiReturn } = whoamiReturn

	const user = data?.[0]

	useEffect(() => {
		if (!user) {
			refetch()
		}
	}, [user])

	return { ...restWhoamiReturn, user, userLoading, refetch }
}
