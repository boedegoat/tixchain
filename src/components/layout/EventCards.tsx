import CalendarIcon from '@/assets/icons/calendar.svg'
import LocationIcon from '@/assets/icons/location.svg'

// ini sebagai placeholder buat events yang mungkin nanti bakal ada
interface Event {
	title: string
	date: string
	location: string
}

// definisiin prop type buat EventCards
interface EventCardsProps {
	events: Event[]
}

export default function EventCards({ events }: EventCardsProps) {
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
							{/* <img src="/icons/calendar.svg" alt="calendar logo" className="pr-1 w-4 h-4" /> */}
							{event.date}
						</p>
						<p className='text-gray-400 text-xs sm:text-sm flex items-center'>
							<LocationIcon className='mr-2' />
							{event.location}
						</p>
						<button className='mt-4 border border-white px-6 py-2 rounded-full text-sm hover:bg-white hover:text-black transition w-full'>
							View Details
						</button>
					</div>
				</div>
			))}
		</div>
	)
}
