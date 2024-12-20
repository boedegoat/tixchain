'use client'

import { useQueryCall } from '@/lib/actor'
import Link from 'next/link'
import { Avatar, AvatarImage } from '../ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown, LogInIcon, LogOut, User } from 'lucide-react'
import { Button } from '../ui/button'
import useAuthConfigured from '@/hooks/use-auth-configured'

export default function Navbar() {
	const { data: user, loading: userLoading } = useQueryCall({
		functionName: 'whoami',
		refetchOnMount: true,
	})
	const { login, logout, authenticating, authenticated } = useAuthConfigured()

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
							className='rounded-[10px] bg-[#D9D9D9] px-4 py-[10px] flex text-black font-bold shadow-[0_0_15px_rgba(217,217,217,0.7)] transition-shadow 
							hover:shadow-[0_0_20px_rgba(217,217,217,0.9)]'
						>
							<LogInIcon className='mr-[19px]' />
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
