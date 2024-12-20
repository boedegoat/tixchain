'use client'

import Link from 'next/link'

// Import SVG components
import HomeIcon from '@/assets/icons/home.svg'
import EventsIcon from '@/assets/icons/events.svg'
import CreateIcon from '@/assets/icons/create.svg'
import TicketIcon from '@/assets/icons/smallTicket.svg'
import ProfileIcon from '@/assets/icons/profile.svg'
import { usePathname } from 'next/navigation'

const links = [
	{
		href: '/home',
		icon: HomeIcon,
		label: 'Home',
	},
	{
		href: '/events',
		icon: EventsIcon,
		label: 'Events',
	},
	{
		href: 'events/create',
		icon: CreateIcon,
		label: 'Create',
	},
	{
		href: '/tickets',
		icon: TicketIcon,
		label: 'Tickets',
	},
	{
		href: '/profile',
		icon: ProfileIcon,
		label: 'Profile',
	},
]

const BottomNavbar = () => {
	const pathname = usePathname()

	return (
		<div className='mt-20'>
			<nav className='fixed bottom-0 left-0 w-full border-t border-gray-700 bg-[#131313]'>
				<div className='flex justify-around items-center py-3'>
					{links.map((link) => {
						const Icon = link.icon

						return (
							<Link key={link.href} href={link.href}>
								<div
									className={`group flex flex-col items-center cursor-pointer ${
										pathname === link.href ? 'text-[#1EFFB9]' : 'text-gray-400'
									}`}
								>
									<Icon
										className={`w-6 h-6 mb-1 group-hover:stroke-[#1EFFB9] ${
											pathname === link.href ? 'stroke-[#1EFFB9]' : 'stroke-gray-400'
										}`}
									/>
									<span className='text-xs group-hover:text-[#1EFFB9]'>{link.label}</span>
								</div>
							</Link>
						)
					})}
				</div>
			</nav>
		</div>
	)
}

export default BottomNavbar
