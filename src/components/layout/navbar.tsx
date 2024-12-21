'use client'

import { useQueryCall, useUpdateCall } from '@/lib/actor'
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
import { convertE8sToICP, convertICPToE8s, truncateAddress } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import toast from 'react-hot-toast'
import useUser from '@/hooks/use-user'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useState } from 'react'

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
	const { call: withdraw } = useUpdateCall({
		functionName: 'withdraw',
	})
	const [withdrawAmount, setWithdrawAmount] = useState(0)

	const onWithdraw = async () => {
		const amountInE8s = convertICPToE8s(withdrawAmount)

		const toastId = toast.loading('Processing withdraw')

		const withdrawResult = (await withdraw([amountInE8s]))!

		if ('err' in withdrawResult) {
			toast.error(withdrawResult.err, { id: toastId })
			return
		}

		toast.success('Withdraw succes', { id: toastId })
		location.reload()
	}

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
												<div>Ledger: {convertE8sToICP(ledgerBalance ?? BigInt(0))} ICP</div>
												<div>App: {convertE8sToICP(appBalance ?? BigInt(0))} ICP</div>

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
											<Dialog>
												<DialogTrigger asChild>
													<Button
														size={'sm'}
														variant={'outline'}
														className='w-full mt-2 text-[10px]'
													>
														Withdraw from App
													</Button>
												</DialogTrigger>
												<DialogContent>
													<DialogHeader>
														<DialogTitle>Withdraw ICP</DialogTitle>
														<DialogDescription>
															Current App Balance:{' '}
															{convertE8sToICP(appBalance ?? BigInt(0))} ICP
														</DialogDescription>
													</DialogHeader>
													<div className='grid gap-4 py-4'>
														<div className='grid grid-cols-4 items-center gap-4'>
															<Label htmlFor='name' className='text-right'>
																Amount
															</Label>
															<Input
																id='amount'
																type='number'
																min={0.0001}
																value={withdrawAmount}
																onChange={(e) =>
																	setWithdrawAmount(Number(e.target.value))
																}
																className='col-span-3'
															/>
														</div>
													</div>
													<DialogFooter>
														<Button type='submit' className='w-full' onClick={onWithdraw}>
															Withdraw
														</Button>
													</DialogFooter>
												</DialogContent>
											</Dialog>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link href='/profile'>
											<User /> Profile
										</Link>
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
