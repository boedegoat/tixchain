"use client";

import { useState } from 'react';
import CalendarIcon from '@/assets/icons/calendar.svg';
import LocationIcon from '@/assets/icons/location.svg';
import CoinIcon from '@/assets/icons/coin.svg';
import UserIcon from '@/assets/icons/users.svg';


export default function MyTickets() {
  const [activeTab, setActiveTab] = useState('purchased'); 

  const purchasedTickets = [
    { title: 'Summer Concert Festival', date: 'Aug 15, 2024 - 2:00 PM', location: 'Grand Indonesia, Jakarta' },
    { title: "Diddy's Festival 2024", date: 'Aug 25, 2024 - 2:00 PM', location: 'Grand Indonesia, Jakarta' },
  ];

  const createdEvents = [
    {
      title: 'Summer Concert Festival',
      date: 'Aug 15, 2024 - 2:00 PM',
      location: 'Grand Indonesia, Jakarta',
      ticketsSold: 150,
      icpCollected: 1500,
    },
    {
      title: "Diddy's Festival 2024",
      date: 'Aug 25, 2024 - 2:00 PM',
      location: 'Grand Indonesia, Jakarta',
      ticketsSold: 200,
      icpCollected: 2000,
    },
  ];

  return (
    <div className="container mx-auto px-6 py-4">
      <h1 className="text-3xl font-bold mb-8">
        My{' '}
        <span className="bg-gradient-to-r from-[#B6FFE8] to-[#1EFFB9] text-transparent bg-clip-text">
          Tickets
        </span>
      </h1>

	  <div className="flex justify-center mt-8 mb-8 border border-[#fff] rounded-lg p-2">
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
			activeTab === 'created'
				? 'bg-[#3C3C3C] text-white'
				: 'bg-black text-gray-400 hover:text-white'
			}`}
			onClick={() => setActiveTab('created')}
		>
			Created Event's
		</button>
	 </div>


      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-y-10 sm:justify-items-center">
        {activeTab === 'purchased' &&
          purchasedTickets.map((ticket, index) => (
            <div
              key={index}
              className="bg-[#131313] rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition border border-[#fff] flex flex-col w-[433px] h-[376px]">
              <div className="h-28 sm:h-40 bg-[#222] border-b border-[#fff]"></div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <h2 className="text-lg font-semibold mb-1">{ticket.title}</h2>
                <p className="text-gray-400 text-xs sm:text-sm flex items-center">
                  <CalendarIcon className="mr-2 w-4 h-4" />
                  {ticket.date}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm flex items-center">
                  <LocationIcon className="mr-2 w-4 h-4" />
                  {ticket.location}
                </p>
                <div className="mt-4 flex justify-between gap-2">
                  <button className="border border-white px-4 py-2 rounded-full text-sm hover:bg-white hover:text-black transition w-40">
                    View Details
                  </button>
                  <button className="bg-[#84DFC2] px-4 py-2 rounded-full text-sm hover:bg-[#00d79f] transition w-28 text-black">
                    Resell
                  </button>
                </div>
              </div>
            </div>
          ))}

        {activeTab === 'created' &&
          createdEvents.map((event, index) => (
            <div
              key={index}
              className="bg-[#131313] rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition border border-[#fff] flex flex-col w-[433px] h-[400px]"
            >
              <div className="h-28 sm:h-40 bg-[#222] border-b border-[#fff]"></div>
              <div className="p-6 flex flex-col justify-between flex-grow gap-2">
                <h2 className="text-lg font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-400 text-xs sm:text-sm flex items-center">
                  <CalendarIcon className="mr-2 w-4 h-4" />
                  {event.date}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm flex items-center">
                  <LocationIcon className="mr-2 w-4 h-4" />
                  {event.location}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm flex items-center">
                  <UserIcon className="mr-2" />
                  {event.icpCollected} ICP Collected</p>
                <p className="text-gray-400 text-xs sm:text-sm flex items-center">
                  <CoinIcon className="mr-2 scale-75 -ml-1" />
                  {event.ticketsSold} tickets sold</p>
                <div className="mt-8 flex justify-between gap-2">
                  <button className="border border-white px-4 py-2 rounded-full text-sm hover:bg-white hover:text-black transition w-36">
                    Withdraw
                  </button>
                  <button className="border border-white bg-red-500 px-4 py-2 rounded-full text-sm hover:bg-red-600 transition w-28 text-white">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
