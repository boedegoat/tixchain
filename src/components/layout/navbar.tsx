'use client'

import { useQueryCall, useUpdateCall } from '@/lib/actor'
import { generateImageFromUsername, generateUsernameFromId, getUserDepositAddress } from '@/lib/utils'
import { useAuth } from '@ic-reactor/react'
import Link from 'next/link'
import { Avatar, AvatarImage } from '../ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown, LogOut, User } from 'lucide-react'
import { Button } from '../ui/button'

export default function Navbar() {
	const { call: whoami } = useUpdateCall({
		functionName: 'whoami',
	})
	const { data: user, loading: userLoading } = useQueryCall({
		functionName: 'whoami',
		refetchOnMount: true,
	})

	const { login, logout, authenticating, authenticated } = useAuth({
		async onLoginSuccess(principal) {
			const username = generateUsernameFromId(principal.toText())
			const depositAddress = getUserDepositAddress(principal)
			const image = generateImageFromUsername(username)
			const result = await authenticateUser([username, depositAddress, image])
			if (result && 'ok' in result) {
				await whoami()
			}
		},
	})
	const { call: authenticateUser } = useUpdateCall({
		functionName: 'authenticateUser',
	})

	return (
		<>
			<nav>
				<div className='container mx-auto flex items-center justify-between'>
					<Link href='/'>
						<img src='/images/logo.png' alt='tixchain logo' className='-mb-6 w-[180px]' />
					</Link>
					{!authenticated && (
						<button
							onClick={() => login()}
							disabled={authenticating}
							className='rounded-[10px] bg-[#D9D9D9] px-4 py-[10px] flex text-black font-bold'
						>
							<img src='/icons/sign-in.svg' alt='sign in' className='mr-[19px]' />
							Sign In
						</button>
					)}

					{authenticated && (
						<div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button className='flex items-center' variant={'ghost'}>
										{userLoading ? (
											'loading...'
										) : (
											<>
												<Avatar className='w-7 h-7 mr-1'>
													<AvatarImage src={user?.[0]?.imageUrl} />
												</Avatar>
												<p>{user?.[0]?.username}</p>
												<ChevronDown />
											</>
										)}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='center'>
									<DropdownMenuItem>
										<User /> Profile
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => logout()}>
										<LogOut />
										Logout
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					)}
				</div>
			</nav>
		</>
	)
}
