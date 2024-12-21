'use client'

import { useQueryCall } from '@/lib/actor'
import Link from 'next/link'
import { Avatar, AvatarImage } from '../ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, CopyIcon, LogInIcon, LogOut, User } from 'lucide-react'
import { Button } from '../ui/button'
import useAuthConfigured from '@/hooks/use-auth-configured'
import { convertE8sToICP, truncateAddress } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import toast from 'react-hot-toast'
import useUser from '@/hooks/use-user'

export default function Navbar() {
	const { user, userLoading } = useUser()
	const { data: ledgerBalance } = useQueryCall({
		functionName: 'getLedgerBalance',
		refetchOnMount: true,
	})
	const { data: appBalance } = useQueryCall({
		functionName: 'getAppBalance',
		refetchOnMount: true,
	})
	const { login, logout, authenticating, authenticated, depositAddress } = useAuthConfigured()

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
													<AvatarImage src={user?.imageUrl} />
												</Avatar>
												<p>{user?.username}</p>
												<ChevronDown />
											</>
										)}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='end'>
									<DropdownMenuLabel>
										<div>
											<div className='mt-2'>
												<div>{convertE8sToICP(ledgerBalance ?? BigInt(0))} ICP</div>

												<div className='text-sm text-muted-foreground'>
													Deposit Address:{' '}
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger asChild>
																<button
																	onClick={() => {
																		navigator.clipboard.writeText(depositAddress)
																		toast.success('Deposit address copied')
																	}}
																	className='inline-flex items-center gap-1 rounded-md hover:bg-muted p-0.5'
																>
																	{truncateAddress(depositAddress)}{' '}
																	<CopyIcon className='w-3 h-3' />
																</button>
															</TooltipTrigger>
															<TooltipContent>
																<p>Copy Address</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</div>
											</div>
											<Button size={'sm'} variant={'outline'} className='w-full mt-2 text-[10px]'>
												Withdraw {appBalance && <div>{convertE8sToICP(appBalance)} ICP</div>}{' '}
												ICP from App Balance
											</Button>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
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
