'use client'

import EventCard from '@/components/events/EventCard'
import { useQueryCall, useUpdateCall } from '@/lib/actor'
import { transferICPToBackendCanister } from '@/lib/utils'
import { useAuthState } from '@ic-reactor/react'
import toast from 'react-hot-toast'

export default function ResoldPage() {
	const { data: eventsResponse, loading: fetchingEvents } = useQueryCall({
		functionName: 'getEvents',
		refetchOnMount: true,
	})
	const { call: createBuyTicketTx } = useUpdateCall({
		functionName: 'createBuyTicketTx',
	})
	const { call: finalizeBuyTicketTx } = useUpdateCall({
		functionName: 'finalizeBuyTicketTx',
	})
	const { identity } = useAuthState()

	const onBuyTicket = async (eventId: string, quantity: bigint) => {
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
			location.href = '/tickets'
		} catch (error) {
			toast.error('Something went wrong', { id: toastId })
			console.log('buy ticket error:', error)
		}
	}

	const events = eventsResponse && 'ok' in eventsResponse ? eventsResponse.ok : []
	const resoldEvents = events.filter((event) => 'resold' in event.eventType)

	return (
		<div className='container mx-auto px-6 py-4 '>
			<h1 className='text-4xl font-bold mb-8'>
				<span className='bg-gradient-to-r from-[#B6FFE8] to-[#1EFFB9] text-transparent bg-clip-text'>
					Resold Events
				</span>
			</h1>

			{fetchingEvents ? (
				'loading...'
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 flex-grow gap-x-20 gap-y-10 rounded-xl'>
					{resoldEvents.map((event) => (
						<EventCard key={event.id} event={event} onBuyTicket={onBuyTicket} />
					))}
				</div>
			)}
		</div>
	)
}
