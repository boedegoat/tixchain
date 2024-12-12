'use client'

import { FormEventHandler } from 'react'
import { useQueryCall } from '@/lib/actor'

export default function Home() {
	const { data: greet, call: hi } = useQueryCall({
		functionName: 'hi',
		args: ['guest'],
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
		<main className='p-10'>
			<h1 className='font-bold text-4xl'>ICP Ticket</h1>
			<form onSubmit={onSubmit} className='my-5 flex gap-2'>
				<input
					className='bg-transparent border border-gray-500 rounded-md p-0.5'
					type='text'
					name='name'
					placeholder='name'
				/>
				<button className='bg-blue-500 px-3 font-semibold py-0.5 rounded-md'>greet</button>
			</form>
			<div>result: {greet}</div>
		</main>
	)
}
