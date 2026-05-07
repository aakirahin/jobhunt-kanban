"use client"

import { Calendar, House, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '../_context/authentication'
import { useState } from 'react'


const Sidebar = () => {
    const { user } = useAuth()
    const [selected, setSelected] = useState<string>(window.location.pathname ?? "")

    const links = [
        {
            id: "home",
            label: "Home",
            icon: <House size={16}/>,
            href: `/user/${user?.id}`
        },
        {
            id: "backlog",
            label: "Backlog",
            icon: <Calendar size={16}/>,
            href: `/user/${user?.id}/backlog`
        },
        {
            id: "friends",
            label: "Friends",
            icon: <Users size={16}/>,
            href: `/user/${user?.id}/friends`
        },
    ]

    return (
        <div className='bg-[#FFF987] rounded-[20px] min-h-[calc(100vh-2rem)] w-1/6 m-4 p-4 flex flex-col gap-2'>
            <Image
                src="/logo.svg"
                alt="Logo"
                width={150}
                height={50}
                className='m-2 mb-4'
            />
            {
                links.map((link) => (
                    <Link 
                        key={link.id}
                        href={link.href}
                        onClick={() => setSelected(link.href)}
                        className={`${selected === link.href ? "bg-[#3A3A3A] text-[#FFF987]" : "text-[#3A3A3A] hover:bg-[#3A3A3A25]"} font-medium py-2 px-4 rounded-lg flex gap-2 items-center cursor-pointer transition-colors duration-300`}
                    >
                        {link.icon}
                        <span className='text-sm'>{link.label}</span>
                    </Link>
                ))
            }
        </div>
    )
}

export default Sidebar