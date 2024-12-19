export default function UserTicketPage() {
	const events = [
		{
			title: 'Summer Concert Festival',
			date: 'Aug 15, 2024 - 2:00 PM',
			location: 'Grand Indonesia, Jakarta',
		},
		{
			title: 'Summer Concert Festival',
			date: 'Aug 15, 2024 - 2:00 PM',
			location: 'Grand Indonesia, Jakarta',
		},
	]

	return (
		<div className='container mx-auto px-6 py-4 pb-24'>
			<h1 className='text-4xl font-semibold mb-6'>
				My{' '}
				<span className='bg-gradient-to-r from-[#B6FFE8] to-[#1EFFB9] text-transparent bg-clip-text'>
					Tickets
				</span>
			</h1>

			{/* Event Cards */}
			<div className='space-y-6'>
				{events.map((event, index) => (
					<div
						key={index}
						className='bg-[#131313] rounded-2xl overflow-hidden shadow-lg border border-[#fff] flex flex-col'
					>
						{/* Image Placeholder */}
						<div className='h-40 bg-[#222] border-b border-[#fff]'></div>

						{/* Event Details */}
						<div className='p-4 flex flex-col justify-between'>
							<h2 className='text-lg font-semibold mb-2'>{event.title}</h2>
							<p className='text-gray-400 text-sm'>{event.date}</p>
							<p className='text-gray-400 text-sm'>{event.location}</p>
							<div className='mt-4 flex justify-between items-center'>
								<button className='border border-white px-4 py-2 rounded-full text-sm hover:bg-white hover:text-black transition'>
									View Details
								</button>
								<button className='bg-[#84DFC2] text-[#131313] px-4 py-2 rounded-full hover:bg-[#1EFFB9] transition'>
									Transfer
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
