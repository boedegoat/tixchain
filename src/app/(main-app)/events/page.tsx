import EventCards from '@/components/layout/EventCards'

export default function EventPage() {
	const events = [
		{ title: 'Summer Concert Festival', date: 'Aug 15, 2024 - 2:00 PM', location: 'Grand Indonesia, Jakarta' },
		{ title: "Diddy's Festival 2024", date: 'Aug 15, 2024 - 2:00 PM', location: 'Grand Indonesia, Jakarta' },
		{ title: 'Rumah Rahman', date: 'Aug 15, 2024 - 2:00 PM', location: 'Grand Indonesia, Jakarta' },
		{ title: 'Summer Concert Festival', date: 'Aug 15, 2024 - 2:00 PM', location: 'Grand Indonesia, Jakarta' },
		{ title: "Diddy's Festival 2024", date: 'Aug 15, 2024 - 2:00 PM', location: 'Grand Indonesia, Jakarta' },
		{ title: 'Rumah Rahman', date: 'Aug 15, 2024 - 2:00 PM', location: 'Grand Indonesia, Jakarta' },
	]

	return (
		<div className='container mx-auto px-6 py-4 '>
			<h1 className='text-4xl font-bold mb-8'>
				Upcoming{' '}
				<span className='bg-gradient-to-r from-[#B6FFE8] to-[#1EFFB9] text-transparent bg-clip-text'>
					Events
				</span>
			</h1>

			<EventCards events={events} />
		</div>
	)
}
