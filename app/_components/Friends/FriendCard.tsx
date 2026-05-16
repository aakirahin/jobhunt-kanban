import { FriendUser } from '@/lib/hooks/friends'
import Avatar from './Avatar'
import StatusBadge from './StatusBadge'
import Link from 'next/link'
import { Button } from '../ui/button'
import { buttonClass } from '@/lib/tailwindClasses'
import RemoveFriend from './RemoveFriend'

type Props = {
    user: FriendUser
    userId: string
    onRemove: () => void
    isRemoving: boolean
}

const FriendCard = ({ 
    user, 
    userId, 
    onRemove, 
    isRemoving 
}: Props) => {
    return (
        <div className="bg-white shadow-[0px_4px_0px_#3A3A3A] p-4 rounded-xl border flex flex-col gap-3">
            <div className='flex items-center gap-3'>
                <Avatar src={user.avatar} name={user.name} />
                <div className="flex flex-col gap-1">
                    <span className="font-medium text-[#3A3A3A] truncate">{user.name ?? user.email}</span>
                    <StatusBadge status={user.status} />
                </div>
            </div>
            <div className="flex gap-2 w-full">
                <Link href={`/user/${userId}/friends/${user.id}`} className='w-1/2'>
                    <Button className={`w-full ${buttonClass}`} variant="secondary">
                        View board
                    </Button>
                </Link>
                <RemoveFriend onRemove={onRemove} isRemoving={isRemoving}/>
            </div>
        </div>
    )
}

export default FriendCard