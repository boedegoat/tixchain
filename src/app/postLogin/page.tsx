import EventCards from '@/components/layout/EventCards';
import BottomNavbar from "@/components/layout/BottomNavbar";

export default function PostLoginPage() {
    const events = [
        { title: "Summer Concert Festival", date: "Aug 15, 2024 - 2:00 PM", location: "Grand Indonesia, Jakarta" },
        { title: "Diddy's Festival 2024", date: "Aug 15, 2024 - 2:00 PM", location: "Grand Indonesia, Jakarta" },
        { title: "Rumah Rahman", date: "Aug 15, 2024 - 2:00 PM", location: "Grand Indonesia, Jakarta" },
    ];

    return (
        <div className="container mx-auto px-6 py-4 pb-24">
            
            <h1 className="text-4xl font-bold">
                Welcome to Tixchain,{" \n"}
                <span className="bg-gradient-to-r from-[#B6FFE8] to-[#1EFFB9] text-transparent bg-clip-text">
                    
                </span>
            </h1>
            <h1 className="text-4xl font-bold mb-3">
                <span className="bg-gradient-to-r from-[#B6FFE8] to-[#1EFFB9] text-transparent bg-clip-text">
                Benedictus Arthur Suparto  
                </span>
            </h1>
            <h2 className="text-lg font-light mb-4">Your Upcoming Events</h2>

           
            <EventCards events={events} />

            
            <div className="mt-12 space-y-8">

                <div>
                    <h2 className="text-lg font-semibold mb-4">Create a New Event</h2>
                    <button className="bg-[#84DFC2] text-[#346354] font-bold px-6 py-3 rounded-full flex items-center hover:shadow-lg transition hover:bg-[#1EFFB9] hover:text-black">
                        Create Event
                        <span className="ml-2">&rarr;</span>
                    </button>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-4">Browse Events</h2>
                    <button className="border border-white text-white px-6 py-3 rounded-full flex items-center hover:bg-white hover:text-black transition">
                        View All Events
                        <span className="ml-2">&rarr;</span>
                    </button>
                </div>
            </div>

            <BottomNavbar />
        </div>
    );
}
