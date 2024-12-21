import CalendarIcon from '@/assets/icons/calendar.svg'
import LocationIcon from '@/assets/icons/location.svg'

export default function MyTickets() {
  const tickets = [
    { title: 'Summer Concert Festival', date: 'Aug 15, 2024 - 2:00 PM', location: 'Grand Indonesia, Jakarta' },
    { title: "Diddy's Festival 2024", date: 'Aug 25, 2024 - 2:00 PM', location: 'Grand Indonesia, Jakarta' },
    { title: 'Rumah Rahman', date: 'Aug 30, 2024 - 3:00 PM', location: 'Central Park, Jakarta' },
  ]

  return (
    <div className="container mx-auto px-6 py-4">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-8">
        My{' '}
        <span className="bg-gradient-to-r from-[#B6FFE8] to-[#1EFFB9] text-transparent bg-clip-text">
          Tickets
        </span>
      </h1>

      {/* Ticket Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 flex-grow gap-x-20 gap-y-10 rounded-xl">
        {tickets.map((ticket, index) => (
          <div
            key={index}
            className="bg-[#131313] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition border border-[#fff] flex flex-col"
          >
            {/* Placeholder for Ticket Image */}
            <div className="h-28 sm:h-40 bg-[#222] border-b border-[#fff]"></div>

            {/* Ticket Details */}
            <div className="p-4 flex flex-col justify-between flex-grow">
              <h2 className="text-lg font-semibold mb-1">{ticket.title}</h2>
              <p className="text-gray-400 text-xs sm:text-sm flex items-center">
                <CalendarIcon className="mr-2" />
                {ticket.date}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm flex items-center">
                <LocationIcon className="mr-2" />
                {ticket.location}
              </p>
              <div className="mt-4 flex justify-between gap-2">
                <button className="border border-white px-4 py-2 rounded-full text-sm hover:bg-white hover:text-black transition w-full">
                  View Details
                </button>
                <button className="bg-[#1EFFB9] px-4 py-2 rounded-full text-sm hover:bg-[#00d79f] transition w-full text-black">
                  Resell
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
