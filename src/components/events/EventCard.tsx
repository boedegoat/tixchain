'use client'

import CalendarIcon from '@/assets/icons/calendar.svg'
import LocationIcon from '@/assets/icons/location.svg'
import { Event, MyCreatedEvent, MyEvent } from '@/declarations/backend/backend.did'
import { convertE8sToICP, convertICPToE8s } from '@/lib/utils'
import { useEffect, useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '../ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useQueryCall } from '@/lib/actor'
import { UserIcon, UsersIcon } from 'lucide-react'
import CoinIcon from '@/assets/icons/coin.svg'

// definisiin prop type buat EventCards
interface EventCardsProps {
	event: Event | MyEvent | MyCreatedEvent
	onBuyTicket?: (eventId: string, quantity: bigint) => Promise<void>
	onResellTicket?: (eventId: string, ticketPrice: bigint, totalTickets: bigint) => Promise<void>
	showSeller?: boolean
}

export default function EventCard({ event, onBuyTicket, onResellTicket, showSeller = true }: EventCardsProps) {
	const [quantity, setQuantity] = useState(BigInt(1))
	const [showDetails, setShowDetails] = useState(false)
	const [resellTicketPrice, setResellTicketPrice] = useState(0)
	const [resellQuantity, setResellQuantity] = useState(BigInt(0))
	const [sellerUsername, setSellerUsername] = useState('')
	const [originalSellerUsername, setOriginalSellerUsername] = useState('')
	const { loading: usernameLoading, call: getUsernameById } = useQueryCall({
		functionName: 'getUsernameById',
		args: [event.owner],
	})
	const { data: originalEventDetailsResponse, loading: originalEventDetailsResponseLoading } = useQueryCall({
		functionName: 'getEventDetails',
		args: event.originalEventId.length > 0 ? [event.originalEventId[0]!] : [''],
	})

	const originalEventDetails =
		originalEventDetailsResponse && 'ok' in originalEventDetailsResponse ? originalEventDetailsResponse.ok : null

	useEffect(() => {
		getUsernameById([event.owner]).then((res) => {
			if (res && 'ok' in res) {
				setSellerUsername(res.ok)
			}
		})
	}, [])

	useEffect(() => {
		if ('resell' in event.eventType && originalEventDetails) {
			getUsernameById([originalEventDetails.owner]).then((res) => {
				if (res && 'ok' in res) {
					setOriginalSellerUsername(res.ok)
				}
			})
		}
	}, [originalEventDetails])

	return (
		<div className='bg-[#131313] min-w-[367px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition border border-[#fff] flex flex-col'>
			{/* ini Placeholder buat Event Image */}
			<div className='h-28 sm:h-40 bg-[#222] border-b border-[#fff]'></div>

			{/* isi dari event Details */}
			<div className='p-4 flex flex-col justify-between flex-grow'>
				<h2 className='text-lg font-semibold mb-1 flex items-center justify-between'>
					<span>{event.title}</span>
					{'ownedTickets' in event && <Badge variant={'outline'}>x{event.ownedTickets}</Badge>}
				</h2>
				<p className='text-gray-400 text-xs sm:text-sm flex items-center'>
					<CalendarIcon className='mr-2' />
					{new Date(event.date).toLocaleString()}
				</p>
				<p className='text-gray-400 text-xs sm:text-sm flex items-center'>
					<LocationIcon className='mr-2' />
					{event.location}
				</p>
				{showSeller && (
					<>
						<p className='text-gray-400 text-xs sm:text-sm flex items-center'>
							<UserIcon className='mr-2 w-4 h-4 text-white' />
							{'resell' in event.eventType ? 'Reseller' : 'Seller'}:{' '}
							{usernameLoading ? 'loading...' : sellerUsername}
						</p>
						{'resell' in event.eventType && (
							<p className='text-gray-400 text-xs sm:text-sm flex items-center'>
								<UserIcon className='mr-2 w-4 h-4 text-white' />
								Original seller:{' '}
								{originalEventDetailsResponseLoading ? 'loading...' : originalSellerUsername}
							</p>
						)}
					</>
				)}
				{'collected' in event && (
					<p className='text-gray-400 text-xs sm:text-sm flex items-center'>
						<CoinIcon className='mr-2 scale-75 -ml-1' />
						<span className='-ml-0.5'>{convertE8sToICP(event.collected)} ICP Collected</span>
					</p>
				)}
				{'ticketsSold' in event && (
					<p className='text-gray-400 text-xs sm:text-sm flex items-center'>
						<UsersIcon className='mr-2 w-[17px] h-[17px] text-white' />
						{event.ticketsSold} tickets sold
					</p>
				)}
				{onBuyTicket && (
					<>
						<p className='mt-[11px] font-bold text-[13px]'>
							Price: {convertE8sToICP(event.ticketPrice)} ICP
						</p>
						<p className='text-gray-400 text-xs sm:text-sm'>Available Tickets: {event.availableTickets}</p>
						<div className='mt-1 flex justify-between'>
							<p className='text-[13px]'>Quantity:</p>
							<div className='flex gap-[5px] text-black'>
								<button
									disabled={quantity <= 1}
									className='w-[25px] h-[25px] rounded-[4px] bg-[#D9D9D9]'
									onClick={() => {
										setQuantity((prev) => prev - BigInt(1))
									}}
								>
									-
								</button>
								<input
									type='number'
									min={1}
									value={quantity.toString()}
									onChange={(e) => setQuantity(BigInt(e.target.value))}
									className='bg-[#D9D9D9] rounded-[4px] h-[25px] w-[42px] text-center'
								/>
								<button
									onClick={() => {
										setQuantity((prev) => prev + BigInt(1))
									}}
									className='w-[25px] h-[25px] rounded-[4px] bg-[#D9D9D9]'
								>
									+
								</button>
							</div>
						</div>
					</>
				)}
				<div className='mt-4 flex gap-5'>
					<Dialog open={showDetails} onOpenChange={setShowDetails}>
						<DialogTrigger asChild>
							<button className='border border-white px-6 py-2 rounded-[14px] text-sm hover:bg-white hover:text-black transition w-full'>
								View Details
							</button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle
									className='font-bold w-max'
									style={{
										background: 'linear-gradient(90deg, #A5E5D1 0%, #5C7F74 100%)',
										backgroundClip: 'text',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
									}}
								>
									{event.title}
								</DialogTitle>
								<DialogDescription className='text-white'>
									{new Date(event.date).toLocaleString()} - {event.location}
								</DialogDescription>
							</DialogHeader>
							<div>
								{event.imageUrl?.[0] && (
									<img className='max-h-[134px]' src={event.imageUrl?.[0]} alt={event.title} />
								)}
								<p>{event.description}</p>
								<Button
									className='w-full mt-4 bg-transparent border border-white rounded-[14px] text-white hover:text-black py-3'
									onClick={() => setShowDetails(false)}
								>
									Close
								</Button>
							</div>
						</DialogContent>
					</Dialog>

					{onBuyTicket && (
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<button
									disabled={event.availableTickets <= 0}
									className='border border-white px-6 py-2 rounded-[14px] text-sm bg-[#37876E] transition w-full hover:shadow-[0_0_15px_rgba(55,135,110,0.7)] hover:bg-[#429881] disabled:pointer-events-none disabled:opacity-60'
								>
									{event.availableTickets <= 0 ? 'Ticket Sold Out' : 'Buy Ticket'}
								</button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle className='text-center'>
										Are you sure you want to buy this ticket?
									</AlertDialogTitle>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel className='w-full bg-[#690000] hover:bg-[#4d0000] text-white border border-white rounded-[10px]'>
										No
									</AlertDialogCancel>
									<AlertDialogAction
										className='w-full bg-[#346354] hover:bg-[#254940] text-white border border-white rounded-[10px]'
										onClick={() => onBuyTicket(event.id, quantity)}
									>
										Yes
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					)}

					{onResellTicket && (
						<Dialog>
							<DialogTrigger asChild>
								<button className='bg-[#84DFC2] px-4 py-2 rounded-full text-sm hover:bg-[#00d79f] transition w-28 text-black'>
									Resell
								</button>
							</DialogTrigger>
							<DialogContent className='sm:max-w-[425px]'>
								<DialogHeader>
									<DialogTitle
										style={{
											background: 'linear-gradient(90deg, #A5E5D1 0%, #5C7F74 100%)',
											backgroundClip: 'text',
											WebkitBackgroundClip: 'text',
											WebkitTextFillColor: 'transparent',
										}}
										className='w-max font-bold'
									>
										Resell Ticket
									</DialogTitle>
								</DialogHeader>
								<div className='grid gap-4 py-4'>
									<div className='grid grid-cols-4 items-center gap-4'>
										<Label htmlFor='ticketPrice' className='text-right'>
											Price (ICP)
										</Label>
										<Input
											id='ticketPrice'
											name='ticketPrice'
											placeholder={`Max: ${convertE8sToICP(event.resellMaxPrice)} ICP`}
											type='number'
											value={resellTicketPrice}
											onChange={(e) => setResellTicketPrice(Number(e.target.value))}
											className='col-span-3'
										/>
									</div>
									<div className='grid grid-cols-4 items-center gap-4'>
										<Label htmlFor='quantity' className='text-right'>
											Quantity
										</Label>
										<Input
											id='quantity'
											name='quantity'
											type='number'
											className='col-span-3'
											placeholder={`Max: ${(event as MyEvent).ownedTickets}`}
											value={resellQuantity.toString()}
											onChange={(e) => setResellQuantity(BigInt(e.target.value))}
										/>
									</div>
								</div>
								<p>
									The event organizer has set the maximum resell price to{' '}
									{convertE8sToICP(event.resellMaxPrice)} ICP.
								</p>
								<DialogFooter>
									<Button
										type='submit'
										onClick={() =>
											onResellTicket(event.id, convertICPToE8s(resellTicketPrice), resellQuantity)
										}
										className='w-full rounded-[10px] border border-white bg-transparent text-white hover:bg-white hover:text-black'
									>
										Confirm Resell
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					)}
				</div>
			</div>
		</div>
	)
}
