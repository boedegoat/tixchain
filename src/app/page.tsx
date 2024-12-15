'use client'

import { FormEventHandler } from 'react'
import { useUpdateCall } from '@/lib/actor'
import { useAuth } from '@ic-reactor/react'
import { Button } from '@/components/ui/button'
import { getUserDepositAddress } from '@/lib/utils'

export default function Home() {
	const {
		data: greet,
		call: hi,
		loading,
	} = useUpdateCall({
		functionName: 'hi',
	})
	const { login, logout, identity, authenticated, authenticating, loginLoading, loginError } = useAuth()

	const principal = identity?.getPrincipal()

	const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault()

		const formData = new FormData(e.currentTarget)
		const name = formData.get('name')?.toString()

		if (!name) {
			alert('please insert name')
			return
		}

		await hi([name])
	}

	return (
		<main className='p-10'>
			<h1 className='font-bold text-4xl'>TixChain</h1>
			<form onSubmit={onSubmit} className='my-5 flex gap-2'>
				<input
					className='bg-transparent border border-gray-500 rounded-md p-0.5'
					type='text'
					name='name'
					placeholder='name'
				/>
				<Button className='bg-blue-500' disabled={loading}>
					{loading ? 'loading' : 'greet'}
				</Button>
			</form>
			{greet && !loading && <div>result: {greet}</div>}
			<div>
				{loginLoading && <div>Loading...</div>}
				{loginError ? <div>{JSON.stringify(loginError)}</div> : null}
				{identity && <div>Principal ID: {principal?.toText()}</div>}
				{principal && <div>Deposit Address : {getUserDepositAddress(principal)}</div>}
			</div>
			{authenticated ? (
				<div>
					<Button onClick={() => logout()}>Logout</Button>
				</div>
			) : (
				<div>
					<Button onClick={() => login()} disabled={authenticating}>
						Login
					</Button>
				</div>
			)}
		</main>
	)
}
