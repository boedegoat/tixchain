'use client'

import { AgentProvider } from '@ic-reactor/react'
import { AgentProviderProps } from '@ic-reactor/react/dist/types'
import React from 'react'

export default function ICPAgentProvider({ children, ...props }: React.PropsWithChildren & AgentProviderProps) {
	return <AgentProvider {...props}>{children}</AgentProvider>
}
