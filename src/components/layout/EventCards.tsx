'use client'

import CalendarIcon from '@/assets/icons/calendar.svg'
import LocationIcon from '@/assets/icons/location.svg'
import { Event } from '@/declarations/backend/backend.did'
import { convertE8sToICP, transferICPToBackendCanister } from '@/lib/utils'
import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import toast from 'react-hot-toast'
import { useUpdateCall } from '@/lib/actor'
import { useRouter } from 'next/navigation'
import useAuthConfigured from '@/hooks/use-auth-configured'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

// definisiin prop type buat EventCards
interface EventCardsProps {
	events: Event[]
}

export default function EventCards({ events }: EventCardsProps) {
	const [quantity, setQuantity] = useState(BigInt(1))
	const [showDetails, setShowDetails] = useState(false)
	const { call: createBuyTicketTx } = useUpdateCall({
		functionName: 'createBuyTicketTx',
	})
	const { call: finalizeBuyTicketTx } = useUpdateCall({
		functionName: 'finalizeBuyTicketTx',
	})
	const { identity } = useAuthConfigured()
	const router = useRouter()

	const onBuyTicket = async (eventId: string) => {
		if (!identity) {
			return
		}
		const toastId = toast.loading('Buying ticket, please wait')
		try {
			const buyTicketTxResult = (await createBuyTicketTx([eventId, quantity]))!

			if ('err' in buyTicketTxResult) {
				toast.error(buyTicketTxResult.err as string, { id: toastId })
				return
			}

			const transaction = buyTicketTxResult.ok
			const transferResult = await transferICPToBackendCanister(
				identity,
				transaction.amount + transaction.platformFee
			)

			if (!transferResult) {
				toast.error('Failed to transfer ICP', { id: toastId })
				return
			}

			const finalizeBuyTicketTxResult = (await finalizeBuyTicketTx([transaction.id, { completed: null }]))!

			if ('err' in finalizeBuyTicketTxResult) {
				toast.error(finalizeBuyTicketTxResult.err as string, { id: toastId })
				return
			}

			toast.success('Buy ticket success', { id: toastId })
			router.refresh()
			router.push('/tickets')
		} catch (error) {
			toast.error('Something went wrong', { id: toastId })
			console.log('buy ticket error:', error)
		}
	}

	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 flex-grow gap-x-20 gap-y-10 rounded-xl'>
			{events.map((event: Event, index: number) => (
				<div
					key={index}
					className='bg-[#131313] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition border border-[#fff] flex flex-col'
				>
					{/* ini Placeholder buat Event Image */}
					<div className='h-28 sm:h-40 bg-[#222] border-b border-[#fff]'></div>

					{/* isi dari event Details */}
					<div className='p-4 flex flex-col justify-between flex-grow'>
						<h2 className='text-lg font-semibold mb-1'>{event.title}</h2>
						<p className='text-gray-400 text-xs sm:text-sm flex items-center'>
							<CalendarIcon className='mr-2' />
							{new Date(event.date).toLocaleString()}
						</p>
						<p className='text-gray-400 text-xs sm:text-sm flex items-center'>
							<LocationIcon className='mr-2' />
							{event.location}
						</p>
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
											<img
												className='max-h-[134px]'
												src={event.imageUrl?.[0]}
												alt={event.title}
											/>
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
											onClick={() => onBuyTicket(event.id)}
										>
											Yes
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
