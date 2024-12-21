'use client'

import useUser from '@/hooks/use-user'
import { useUpdateCall } from '@/lib/actor'
import { useRef } from 'react'
import toast from 'react-hot-toast'

export default function Profile() {
	const { user, userLoading } = useUser()
	const { call: updateUser } = useUpdateCall({
		functionName: 'updateUser',
	})
	const formRef = useRef<HTMLFormElement>(null)

	const onUpdateUser: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)

		const username = formData.get('username')?.toString()
		const name = formData.get('name')?.toString()

		const toastId = toast.loading('Updating user')

		const updateUserResult = (await updateUser([
			{ name: name ? [name] : [], username: username ? [username] : [], depositAddress: [] },
		]))!

		if ('err' in updateUserResult) {
			toast.error(updateUserResult.err, { id: toastId })
			return
		}

		toast.success('Update user success', { id: toastId })
	}

	return (
		<div className='flex flex-col items-center min-h-screen text-white p-6 mt-4'>
			<div className='w-full flex justify-start items-center mb-6 ml-60'>
				<h2 className='text-2xl text font-semibold  bg-gradient-to-r from-[#3ECA9E] to-[#CCFFEF] bg-clip-text text-transparent'>
					Edit Profile
				</h2>
			</div>

			{userLoading ? (
				'loading...'
			) : (
				<div className='rounded-xl p-8 w-full max-w-md text-center'>
					<div className='mb-6'>
						<div className='relative w-44 h-44 bg-[#4E4E4E] rounded-full mx-auto mb-4'>
							<img src={user?.imageUrl} alt='profpic' className='absolute inset-0 rounded-full' />
						</div>
						<button className='w-44 h-10 bg-black text-white px-4 py-2 rounded-lg border border-white mt-4'>
							Change Avatar
						</button>
					</div>

					<form onSubmit={onUpdateUser} className='flex flex-col gap-4' ref={formRef}>
						<div>
							<label className='block text-left mb-2'>Username</label>
							<input
								type='text'
								name='username'
								defaultValue={user?.username}
								placeholder='Username'
								className='w-full bg-[#D9D9D9] text-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
							/>
						</div>
						<div>
							<label className='block text-left mb-2'>Fullname</label>
							<input
								type='text'
								name='name'
								defaultValue={user?.name}
								placeholder='Email'
								className='w-full bg-[#D9D9D9] text-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-6'
							/>
						</div>
						<button
							type='submit'
							className='bg-gradient-to-r from-[#004F36] to-[#A5E5D1] text-white px-6 py-2 rounded-lg hover:bg-teal-600'
						>
							Update Profile
						</button>
					</form>
				</div>
			)}
		</div>
	)
}
