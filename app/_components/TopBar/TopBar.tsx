"use client"

import Notification from './Notification'
import Avatar from './Avatar'
import { User } from '@supabase/supabase-js'
import { usePathname } from 'next/navigation'

type Props = 
    { user: null, guest: true } | 
    { user: User | null, guest: false }

const TopBar = ({
    user,
    guest
}: Props) => {
    const pathname = usePathname()
    const suffix = pathname.split("/")[3]
    const heading = {
        friends: "Friends",
        report: "Job Report",
        profile: "Profile",
    }
    
    return (
        <div className="flex justify-between">
            <h3 className='font-medium font-momo text-3xl'>
                {
                    suffix ?
                    heading[suffix] : "Home"
                }
            </h3>
            <div className="flex gap-4 items-center">
                <Notification/>
                <Avatar user={user} guest={guest}/>
            </div>
        </div>
    )
}

export default TopBar