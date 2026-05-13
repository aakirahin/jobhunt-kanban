import { Input } from '../ui/input'
import Notification from './Notification'
import Avatar from './Avatar'
import { User } from '@supabase/supabase-js'

type Props = 
    { user: null, guest: true } | 
    { user: User | null, guest: false }

const TopBar = ({
    user,
    guest
}: Props) => {
    return (
        <div className="flex justify-between">
            <Input className="w-1/5" placeholder="Search"/>
            <div className="flex gap-4 items-center">
                <Notification/>
                <Avatar user={user} guest={guest}/>
            </div>
        </div>
    )
}

export default TopBar