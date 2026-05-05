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
} from "./ui/dropdown-menu"
import { LogOut, Settings, User as UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
    user: User | null
}


const Avatar = ({
    user
}: Props) => {
    const router = useRouter()
    const supabase = createSupabaseBrowserClient()
    
    const handleSignOut = async () => {
        await supabase.auth.signOut()
        window.location.href = '/authenticate'
    }
    
    const menuItems = [
        {
            label: "Profile",
            icon: <UserIcon size={20}/>,
            onClick: () => router.push(`/user/${user?.id}/account`)
        },
        {
            label: "Settings",
            icon: <Settings size={20}/>,
            onClick: () => router.push(`/user/${user?.id}/settings`)
        },
        {
            label: "Log out",
            icon: <LogOut size={20}/>,
            onClick: handleSignOut,
            variant: "destructive"
        },
    ]

    console.log(user)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Image
                    src={user?.user_metadata.avatar_url}
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
                                onClick={item.onClick} 
                                variant={item.variant}
                                className={`p-2 my-1 text-muted-foreground items-center cursor-pointer`}
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