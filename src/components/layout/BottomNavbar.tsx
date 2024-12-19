"use client";

import Link from "next/link";
import { useState } from "react";

// Import SVG components
import HomeIcon from "@/assets/icons/home.svg";
import EventsIcon from "@/assets/icons/events.svg";
import CreateIcon from "@/assets/icons/create.svg";
import TicketIcon from "@/assets/icons/smallTicket.svg";
import ProfileIcon from "@/assets/icons/profile.svg";

const BottomNavbar = () => {
  const [active, setActive] = useState("Home");

  return (
    <nav className="fixed bottom-0 left-0 w-full border-t border-gray-700 bg-[#131313]">
      <div className="flex justify-around items-center py-3">
        
        {/* Home */}

        <Link href="/" onClick={() => setActive("Home")}>
          <div
            className={`group flex flex-col items-center cursor-pointer ${
              active === "Events" ? "text-[#1EFFB9]" : "text-gray-400"
            }`}
          >
            <HomeIcon
              className={`w-6 h-6 mb-1 group-hover:text-[#1EFFB9] ${
                active === "Events" ? "text-[#1EFFB9]" : "text-gray-400"
              }`}
            />
            <span className="text-xs group-hover:text-[#1EFFB9]">Home</span>
          </div>
        </Link>

        {/* <Link href="/" onClick={() => setActive("Home")}>
          <div
            className={`group flex flex-col items-center cursor-pointer ${
              active === "Home" ? "text-[#1EFFB9]" : "text-gray-400"
            }`}
          >
            <HomeIcon
              className={`w-6 h-6 mb-1 group-hover:text-[#1EFFB9] ${
                active === "Home" ? "text-[#1EFFB9]" : "text-gray-400"
              }`}
            />
            <span className="text-xs group-hover:text-[#1EFFB9]">Home</span>
          </div>
        </Link> */}

        {/* Events */}
        <Link href="/events" onClick={() => setActive("Events")}>
          <div
            className={`group flex flex-col items-center cursor-pointer ${
              active === "Events" ? "text-[#1EFFB9]" : "text-gray-400"
            }`}
          >
            <EventsIcon
              className={`w-6 h-6 mb-1 group-hover:text-[#1EFFB9] ${
                active === "Events" ? "text-[#1EFFB9]" : "text-gray-400"
              }`}
            />
            <span className="text-xs group-hover:text-[#1EFFB9]">Events</span>
          </div>
        </Link>

        {/* Create */}
        <Link href="/create" onClick={() => setActive("Create")}>
          <div
            className={`group flex flex-col items-center cursor-pointer ${
              active === "Create" ? "text-[#1EFFB9]" : "text-gray-400"
            }`}
          >
            <CreateIcon
              className={`w-6 h-6 mb-1 ml-[2.9%] group-hover:text-[#1EFFB9] ${
                active === "Create" ? "text-[#1EFFB9]" : "text-gray-400"
              }`}
            />
            <span className="text-xs group-hover:text-[#1EFFB9]">Create</span>
          </div>
        </Link>

        {/* My Tickets */}
        <Link href="/userTickets" onClick={() => setActive("My Tickets")}>
          <div
            className={`group flex flex-col items-center cursor-pointer ${
              active === "My Tickets" ? "text-[#1EFFB9]" : "text-gray-400"
            }`}
          >
            <TicketIcon
              className={`w-6 h-6 mb-1 group-hover:text-[#1EFFB9] ${
                active === "My Tickets" ? "text-[#1EFFB9]" : "text-gray-400"
              }`}
            />
            <span className="text-xs group-hover:text-[#1EFFB9]">My Tickets</span>
          </div>
        </Link>

        {/* Profile */}
        <Link href="/profile" onClick={() => setActive("Profile")}>
          <div
            className={`group flex flex-col items-center cursor-pointer ${
              active === "Profile" ? "text-[#1EFFB9]" : "text-gray-400"
            }`}
          >
            <ProfileIcon
              className={`w-6 h-6 mb-1 group-hover:text-[#1EFFB9] ${
                active === "Profile" ? "text-[#1EFFB9]" : "text-gray-400"
              }`}
            />
            <span className="text-xs group-hover:text-[#1EFFB9]">Profile</span>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavbar;
