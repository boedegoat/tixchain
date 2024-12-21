'use client'

import { useUpdateCall } from '@/lib/actor'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { convertICPToE8s } from '@/lib/utils'
import { useRef } from 'react'

const formSchema = z.object({
	title: z.string().min(3).max(100),
	description: z.string().min(1).max(1000),
	date: z.string().min(1),
	location: z.string().min(1),
	ticketPrice: z.number().min(0),
	totalTickets: z.number().min(0),
	resellMaxPrice: z.number().min(0),
	imageUrl: z.string().optional(),
})

export default function CreateEvent() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			description: '',
			date: '',
			location: '',
			ticketPrice: 0,
			totalTickets: 0,
			resellMaxPrice: 0,
		},
	})
	const { call: createNewEvent } = useUpdateCall({
		functionName: 'createNewEvent',
	})
	const router = useRouter()
	const formRef = useRef<HTMLFormElement>(null)

	async function onCreateNewEvent(values: z.infer<typeof formSchema>) {
		const toastId = toast.loading('Creating event')
		const result = await createNewEvent([
			{
				...values,
				ticketPrice: convertICPToE8s(values.ticketPrice),
				resellMaxPrice: convertICPToE8s(values.resellMaxPrice),
				totalTickets: BigInt(values.totalTickets),
				imageUrl: values.imageUrl ? [values.imageUrl] : [],
			},
		])
		console.log(result)
		if (result) {
			if ('ok' in result) {
				toast.success('Event created', { id: toastId })
				router.push('/events')
				return
			}
			if ('err' in result) {
				toast.error(result.err, { id: toastId })
				return
			}
			toast.error('There is an error', { id: toastId })
		}
	}

	return (
		<div className='min-h-screen text-white flex flex-col items-center'>
			<div className='w-full max-w-3xl p-6 rounded-lg'>
				<h2 className='text-2xl font-semibold mb-14 mt-6'>
					<span className='text-white'>Create </span>
					<span className='bg-gradient-to-r from-[#3ECA9E] to-[#CCFFEF] bg-clip-text text-transparent'>
						New Event
					</span>
				</h2>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onCreateNewEvent)} className='space-y-8' ref={formRef}>
						<FormField
							control={form.control}
							name='title'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Event Title</FormLabel>
									<FormControl>
										<input
											{...field}
											placeholder='Enter Event Title'
											className='w-full p-3 rounded bg-[#D9D9D9] text-black outline-none placeholder-[#626262]'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Event Description</FormLabel>
									<FormControl>
										<textarea
											{...field}
											placeholder='Describe Your Event...'
											className='w-full p-3 rounded bg-[#D9D9D9] text-black outline-none placeholder-[#626262]'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='date'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Event Date</FormLabel>
									<FormControl>
										<input
											{...field}
											type='datetime-local'
											className='w-full p-3 rounded bg-[#D9D9D9] text-[#626262] outline-none'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='location'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Event Location</FormLabel>
									<FormControl>
										<input
											{...field}
											placeholder='Enter Event Location'
											className='w-full p-3 rounded bg-[#D9D9D9] text-[#626262] outline-none'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='ticketPrice'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ticket Price (ICP)</FormLabel>
									<FormControl>
										<input
											{...field}
											value={field.value.toString()}
											placeholder='0.0'
											type='number'
											onChange={(e) => field.onChange(Number(e.target.value))}
											className='w-full p-3 rounded bg-[#D9D9D9] text-[#626262] outline-none'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='totalTickets'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Total Ticket Supply</FormLabel>
									<FormControl>
										<input
											{...field}
											value={field.value.toString()}
											type='number'
											placeholder='Enter total of tickets'
											onChange={(e) => field.onChange(Number(e.target.value))}
											className='w-full p-3 rounded bg-[#D9D9D9] text-[#626262] outline-none'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='resellMaxPrice'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Maximum Resell Price (ICP)</FormLabel>
									<FormControl>
										<input
											{...field}
											value={field.value.toString()}
											type='number'
											placeholder='Enter Maximum Resell Price'
											onChange={(e) => field.onChange(Number(e.target.value))}
											className='w-full p-3 rounded bg-[#D9D9D9] text-[#626262] outline-none'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='imageUrl'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Cover Image Url</FormLabel>
									<FormControl>
										<input
											{...field}
											type='url'
											placeholder='Enter Cover Image Url'
											className='w-full p-3 rounded bg-[#D9D9D9] text-[#626262] outline-none'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<button
							type='submit'
							className='w-full py-3 mt-4 bg-gradient-to-r from-[#004F36] to-[#A5E5D1] rounded-lg font-bold text-white hover:bg-green-600'
						>
							Create Event
						</button>
					</form>
				</Form>
			</div>
		</div>
	)
}
