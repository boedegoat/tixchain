import Link from 'next/link'

export default function Navbar() {
	return (
		<>
			<div className='absolute w-[618px] h-[791.643px] rounded-[791.643px] opacity-[0.87] [background:linear-gradient(180deg,#FFF_0%,#37876E_100%)] [box-shadow:0px_4px_4px_0px_rgba(0,0,0,0.25)] blur-[100px] left-1/2 -translate-x-1/2'></div>
			<nav>
				<div className='container mx-auto flex items-center justify-between'>
					<Link href='/'>
						<img src='/images/logo.png' alt='tixchain logo' />
					</Link>
					<button className='rounded-[10px] bg-[#D9D9D9] px-4 py-[10px] flex text-black font-bold'>
						<img src='/icons/sign-in.svg' alt='sign in' className='mr-[19px]' />
						Sign In
					</button>
				</div>
			</nav>
		</>
	)
}
