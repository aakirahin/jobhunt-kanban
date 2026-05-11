"use client"

import { Input } from '../ui/input'
import Notification from './Notification'
import Avatar from './Avatar'
import { useAuth } from '../../_context/authentication'

const TopBar = () => {
    const { user } = useAuth()

    // TODO: ADD FUNCTIONALITY TO INPUT
    return (
        <div className="flex justify-between">
            <Input className="w-1/5" placeholder="Search"/>
            <div className="flex gap-4 items-center">
                <Notification/>
                <Avatar user={user}/>
            </div>
        </div>
    )
}

export default TopBar