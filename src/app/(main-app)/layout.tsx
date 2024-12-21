'use client'

import BottomNavbar from '@/components/layout/BottomNavbar'
import NoSsrProvider from '@/components/no-ssr-provider'
import { useAuth } from '@ic-reactor/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function MainAppLayout({ children }: React.PropsWithChildren) {
	const { authenticated, authenticating } = useAuth()
	const [loading, setLoading] = useState(true)
	const router = useRouter()

	useEffect(() => {
		if (!authenticating) {
			if (!authenticated) router.replace('/')
			else setLoading(false)
		}
	}, [authenticating, authenticated])

	if (loading) {
		return null
	}

	return (
		<NoSsrProvider>
			{children}
			<BottomNavbar />
		</NoSsrProvider>
	)
}
