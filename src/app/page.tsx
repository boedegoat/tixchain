'use client'

import { FormEventHandler } from 'react'
import { useUpdateCall } from '@/lib/actor'
import { useAuth } from '@ic-reactor/react'

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
			<h1 className='font-bold text-4xl'>ICP Ticket</h1>
			<form onSubmit={onSubmit} className='my-5 flex gap-2'>
				<input
					className='bg-transparent border border-gray-500 rounded-md p-0.5'
					type='text'
					name='name'
					placeholder='name'
				/>
				<button className='bg-blue-500 px-3 font-semibold py-0.5 rounded-md text-white' disabled={loading}>
					{loading ? 'loading' : 'greet'}
				</button>
			</form>
			{greet && !loading && <div>result: {greet}</div>}
			<div>
				{loginLoading && <div>Loading...</div>}
				{loginError ? <div>{JSON.stringify(loginError)}</div> : null}
				{identity && <div>Principal ID: {principal?.toText()}</div>}
			</div>
			{authenticated ? (
				<div>
					<button onClick={() => logout()}>Logout</button>
				</div>
			) : (
				<div>
					<button onClick={() => login()} disabled={authenticating}>
						Login
					</button>
				</div>
			)}
		</main>
	)
}
