'use client'

import { FormEventHandler } from 'react'
import { useQueryCall } from '@/lib/actor'

export default function Home() {
	const { data: greet, call: hi } = useQueryCall({
		functionName: 'hi',
		args: ['asep'],
	})

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
		<main>
			<h1>ICP Next.js</h1>
			<form onSubmit={onSubmit}>
				<input className='bg-transparent' type='text' name='name' placeholder='name' />
				<button>greet</button>
			</form>
			<div>result: {greet}</div>
		</main>
	)
}
