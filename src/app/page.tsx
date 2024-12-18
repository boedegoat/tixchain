import { LogInIcon } from 'lucide-react'
import TicketIcon from '@/assets/icons/ticket.svg'
import ShieldIcon from '@/assets/icons/shield.svg'
import LoopIcon from '@/assets/icons/loop.svg'

export default function Home() {
	return (
		<>
			{/* hero section */}
			<section className='text-center py-[100px]'>
				<div className='container mx-auto'>
					<h1 className='text-[32px] font-bold'>
						Welcome to <span className='text-tixchain-accent'>TixChain</span>
					</h1>
					<p className='text-[24px] mt-2'>The future of online ticketing is here</p>
					<button className='mt-10 mx-auto flex items-center text-[#346354] font-bold px-4 py-[6px] rounded-[10px] [background:linear-gradient(90deg,#84DFC2_0%,#B2DED0_100%)] shadow-[0_0_20px_rgba(132,223,194,0.5)] hover:shadow-[0_0_30px_rgba(132,223,194,0.7)] transition-shadow duration-300'>
						Explore Events <LogInIcon className='ml-3' />
					</button>
				</div>
			</section>

			{/* why choose section */}
			<section className='pb-[124px]'>
				<div className='container mx-auto'>
					<h2 className='text-[30px] font-bold text-center'>
						Why choose <span className='text-tixchain-accent'>TixChain?</span>
					</h2>
					<ul className='flex mt-[65px] justify-center'>
						<li className='text-center flex flex-col items-center'>
							<TicketIcon />
							<h3 className='text-xl font-bold mt-4'>Unique Digital Tickets</h3>
							<p className='max-w-[400px] mt-1'>
								Each ticket is a one-of-a-kind NFT, providing authenticity and collectible value.
							</p>
						</li>
						<li className='text-center flex flex-col items-center'>
							<ShieldIcon />
							<h3 className='text-xl font-bold mt-4'>Unique Digital Tickets</h3>
							<p className='max-w-[400px] mt-1'>
								Each ticket is a one-of-a-kind NFT, providing authenticity and collectible value.
							</p>
						</li>
						<li className='text-center flex flex-col items-center'>
							<LoopIcon />
							<h3 className='text-xl font-bold mt-4'>Unique Digital Tickets</h3>
							<p className='max-w-[400px] mt-1'>
								Each ticket is a one-of-a-kind NFT, providing authenticity and collectible value.
							</p>
						</li>
					</ul>
				</div>
			</section>

			{/* ready to get started section */}
			<section>
				<div className='container mx-auto py-[36px] [background:linear-gradient(90deg,#181818_0%,#242424_100%)] rounded-t-[20px]'>
					<h2 className='text-[30px] font-bold text-center'>
						Ready to Get <span className='text-tixchain-accent'>Started</span>
					</h2>
					<p className='text-center mt-2 text-[20px]'>The future of online ticketing is here</p>
					<button className='mt-10 mx-auto flex items-center text-[#346354] font-bold px-4 py-[6px] rounded-[10px] [background:linear-gradient(90deg,#84DFC2_0%,#B2DED0_100%)] shadow-[0_0_20px_rgba(132,223,194,0.5)] hover:shadow-[0_0_30px_rgba(132,223,194,0.7)] transition-shadow duration-300'>
						Create your first event
					</button>
				</div>
			</section>
		</>
	)
}
