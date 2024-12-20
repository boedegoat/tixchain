export default function CreateEvent() {
    return (
      <div className="min-h-screen text-white flex flex-col items-center">
        <div className="w-full max-w-7xl p-6 rounded-lg">
           <h2 className="text-2xl font-semibold mb-14 mt-6">
            <span className="text-white">Create </span>
            <span className="bg-gradient-to-r from-[#3ECA9E] to-[#CCFFEF] bg-clip-text text-transparent">
                New Event
            </span>
          </h2>
  
          <form className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Event Title</label>
              <input
                type="text"
                placeholder="Enter Event Title"
                className="w-full p-3 rounded bg-[#D9D9D9] text-black outline-none placeholder-[#626262]"
              />
            </div>
  
            <div>
              <label className="block mb-2 font-medium">Event Description</label>
              <textarea
                placeholder="Describe Your Event..."
                className="w-full p-3 rounded bg-[#D9D9D9] text-black outline-none placeholder-[#626262]"
                rows={3}
              ></textarea>
            </div>
  
            <div>
              <label className="block mb-2 font-medium">Event Date</label>
              <input
                type="date"
                className="w-full p-3 rounded bg-[#D9D9D9] text-[#626262] outline-none"
              />
            </div>
  
            <div>
              <label className="block mb-2 font-medium">Event Location</label>
              <input
                type="text"
                placeholder="Enter Event Location"
                className="w-full p-3 rounded bg-[#D9D9D9] text-black outline-none placeholder-[#626262]"
              />
            </div>
  
            <div>
              <label className="block mb-2 font-medium">Ticket Price (ICP)</label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full p-3 rounded bg-[#D9D9D9] text-black outline-none placeholder-[#626262]"
              />
            </div>
  
            <div>
              <label className="block mb-2 font-medium">Total Ticket Supply</label>
              <input
                type="number"
                placeholder="Enter total of tickets"
                className="w-full p-3 rounded bg-[#D9D9D9] text-black outline-none placeholder-[#626262]"
              />
            </div>
  
            <div>
              <label className="block mb-2 font-medium">Maximum Resell Price</label>
              <input
                type="number"
                placeholder="Enter Maximum Resell Price"
                className="w-full p-3 rounded bg-[#D9D9D9] text-black outline-none placeholder-[#626262]"
              />
            </div>
  
            <div>
              <label className="block mb-2 font-medium">Royalty from Resell</label>
              <input
                type="number"
                placeholder="Enter Royalty Percentage"
                className="w-full p-3 rounded bg-[#D9D9D9] text-black outline-none placeholder-[#626262]"
              />
            </div>
  
            <div>
              <label className="block mb-2 font-medium">Cover Image Url</label>
              <input
                type="url"
                placeholder="Enter Cover Image Url"
                className="w-full p-3 rounded bg-[#D9D9D9] text-black outline-none placeholder-[#626262] mb-14"
              />
            </div>
  
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-gradient-to-r from-[#004F36] to-[#A5E5D1] rounded-lg font-bold text-white hover:bg-green-600"
            >
              Create Event
            </button>
          </form>
        </div>
      </div>
    );
  }
  