'use client'

import EventCard from '@/components/events/EventCard'
import useUser from '@/hooks/use-user'
import { useQueryCall } from '@/lib/actor'
import Link from 'next/link'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

export default function PostLoginPage() {
	const { user, userLoading } = useUser()
	const { data: myEventsResponse, loading: myEventsLoading } = useQueryCall({
		functionName: 'getMyEvents',
		refetchOnMount: true,
	})

	const myEvents = myEventsResponse && 'ok' in myEventsResponse ? myEventsResponse.ok : []

	return (
		<div className='container mx-auto px-6 py-4 pb-24'>
			<h1 className='text-4xl font-bold'>
				Welcome to Tixchain,{' \n'}
				<span className='bg-gradient-to-r from-[#B6FFE8] to-[#1EFFB9] text-transparent bg-clip-text'></span>
			</h1>
			<h1 className='text-4xl font-bold mb-3'>
				<span className='bg-gradient-to-r from-[#B6FFE8] to-[#1EFFB9] text-transparent bg-clip-text'>
					{userLoading ? 'loading...' : user?.username}
				</span>
			</h1>

			<div className='mt-4'>
				<h2 className='text-[24px] mb-4'>Your Upcoming Events</h2>
				{myEventsLoading ? (
					'loading...'
				) : (
					<div>
						{myEvents.length > 0 ? (
							<Carousel
								opts={{
									align: 'start',
								}}
							>
								<CarouselContent>
									{myEvents.map((event) => (
										<CarouselItem key={event.id} className='basis-1/3'>
											<EventCard event={event} />
										</CarouselItem>
									))}
								</CarouselContent>
								<CarouselPrevious />
								<CarouselNext />
							</Carousel>
						) : (
							<div>You have no upcoming events</div>
						)}
					</div>
				)}
			</div>

			<div className='mt-12 space-y-8'>
				<div>
					<h2 className='text-[24px] mb-4'>Create a New Event</h2>
					<Link
						href='/events/create'
						className='w-max bg-[#84DFC2] text-[#346354] font-bold px-6 py-3 rounded-full flex items-center hover:shadow-lg transition hover:bg-[#1EFFB9] hover:text-black'
					>
						Create Event
						<span className='ml-2'>&rarr;</span>
					</Link>
				</div>

				<div>
					<h2 className='text-[24px] mb-4'>Browse Events</h2>
					<Link
						href='/events'
						className='w-max border border-white text-white px-6 py-3 rounded-full flex items-center hover:bg-white hover:text-black transition'
					>
						View All Events
						<span className='ml-2'>&rarr;</span>
					</Link>
				</div>
			</div>
		</div>
	)
}
