'use client'

import dynamic from 'next/dynamic'
import React from 'react'

function NoSSRProvider({ children }: React.PropsWithChildren) {
	return <>{children}</>
}

export default dynamic(() => Promise.resolve(NoSSRProvider), {
	ssr: false,
})
