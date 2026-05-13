"use client"

import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { LogIn, LogOut, User as UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
    user: User | null
    guest?: boolean
}

type MenuItem = {
    id: string
    label: string
    icon: React.ReactNode
    onClick: () => void
    variant: "default" | "destructive"
}

const Avatar = ({
    user,
    guest = false
}: Props) => {
    const router = useRouter()
    const supabase = createSupabaseBrowserClient()
    
    const handleSignOut = async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
    }
    
    const menuItems: MenuItem[] = guest ? 
    [
        {
            id: "authenticate",
            label: "Login / Register",
            icon: <LogIn size={20}/>,
            onClick: () => router.push("/"),
            variant: "default"
        }
    ] :
    [
        {
            id: "profile",
            label: "Profile",
            icon: <UserIcon size={20}/>,
            onClick: () => router.push(`/user/${user?.id}/profile`),
            variant: "default"
        },
        {
            id: "logout",
            label: "Log out",
            icon: <LogOut size={20}/>,
            onClick: handleSignOut,
            variant: "destructive"
        },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Image
                    src={user?.user_metadata.avatar_url ?? "/avatar-default.png"}
                    alt="Avatar"
                    width={36}
                    height={36}
                    className='rounded-full cursor-pointer'
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-45 mt-2" align="end">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Account</DropdownMenuLabel>
                    {
                        menuItems.map((item) => (
                            <DropdownMenuItem 
                                key={item.id}
                                onClick={item.onClick} 
                                variant={item.variant}
                                className={`p-2 my-1 items-center cursor-pointer`}
                            >
                                {item.icon}
                                {item.label}
                            </DropdownMenuItem>
                        ))
                    }
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Avatar