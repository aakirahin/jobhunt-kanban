"use client"

import { House, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '../_context/authentication'
import { usePathname } from 'next/navigation'

type Props = {
    guest?: boolean
}

const Sidebar = ({
    guest = false
}: Props) => {
    const { user } = useAuth()
    const selected = usePathname()
    const defaultLinks = [
        {
            id: "home",
            label: "Home",
            icon: <House size={16}/>,
            href: guest ? "/guest" : `/user/${user?.id}`,
        }
    ]
    const links = guest ? defaultLinks : [
        ...defaultLinks,
        {
            id: "friends",
            label: "Friends",
            icon: <Users size={16}/>,
            href: `/user/${user?.id}/friends`,
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