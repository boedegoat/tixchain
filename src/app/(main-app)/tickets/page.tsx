'use client'

import { useState } from 'react'
import { useQueryCall, useUpdateCall } from '@/lib/actor'
import EventCard from '@/components/events/EventCard'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function MyTickets() {
	const [activeTab, setActiveTab] = useState('purchased')
	const { data: myEventsResponse, loading: myEventsLoading } = useQueryCall({
		functionName: 'getMyEvents',
		refetchOnMount: true,
	})
	const { data: myCreatedEventsResponse, loading: myCreatedEventsLoading } = useQueryCall({
		functionName: 'getMyCreatedEvents',
		refetchOnMount: true,
	})
	const { call: createResellEvent } = useUpdateCall({
		functionName: 'createResellEvent',
	})
	const router = useRouter()

	const myEvents = myEventsResponse && 'ok' in myEventsResponse ? myEventsResponse.ok : []
	const myCreatedEvents = myCreatedEventsResponse && 'ok' in myCreatedEventsResponse ? myCreatedEventsResponse.ok : []
	const isLoading = myEventsLoading || myCreatedEventsLoading

	const onResellTicket = async (eventId: string, ticketPrice: bigint, totalTickets: bigint) => {
		const toastId = toast.loading('Creating resell event')
		const createResellEventResult = (await createResellEvent([
			{
				eventId,
				ticketPrice,
				totalTickets,
			},
		]))!

		if ('err' in createResellEventResult) {
			toast.error(createResellEventResult.err, { id: toastId })
			return
		}

		toast.success('Create resell event success', { id: toastId })
		location.href = '/resolds'
	}

	return (
		<div className='container mx-auto px-6 py-4'>
			<h1 className='text-3xl font-bold mb-8'>
				My{' '}
				<span className='bg-gradient-to-r from-[#B6FFE8] to-[#1EFFB9] text-transparent bg-clip-text'>
					Tickets
				</span>
			</h1>

			<div className='flex justify-center mt-8 mb-8 border border-[#fff] rounded-lg p-2'>
				<button
					className={`flex-1 py-2 rounded-l-lg ${
						activeTab === 'purchased'
							? 'bg-[#3C3C3C] text-white'
							: 'bg-black text-gray-400 hover:text-white'
					}`}
					onClick={() => setActiveTab('purchased')}
				>
					Purchased Ticket's
				</button>
				<button
					className={`flex-1 py-2 rounded-r-lg ${
						activeTab === 'created' ? 'bg-[#3C3C3C] text-white' : 'bg-black text-gray-400 hover:text-white'
					}`}
					onClick={() => setActiveTab('created')}
				>
					Created Event's
				</button>
			</div>

			{isLoading ? (
				'loading...'
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-y-10 sm:justify-items-center'>
					{activeTab === 'purchased' &&
						(myEvents.length > 0 ? (
							myEvents.map((event) => (
								<EventCard key={event.id} event={event} onResellTicket={onResellTicket} />
							))
						) : (
							<div>You haven't purchased any tickets yet</div>
						))}

					{activeTab === 'created' &&
						(myCreatedEvents.length > 0 ? (
							myCreatedEvents.map((event) => (
								<EventCard key={event.id} event={event} showSeller={false} />
							))
						) : (
							<div>You haven't created any events yet</div>
						))}
				</div>
			)}
		</div>
	)
}
