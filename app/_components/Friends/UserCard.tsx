import Avatar from './Avatar'
import { FriendUser } from '@/lib/hooks/friends'
import { buttonClass } from '@/lib/tailwindClasses'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import StatusBadge from './StatusBadge'

type Props = {
    user: FriendUser
    onAdd: () => void
    isPending: boolean
}

const UserCard = ({
    user,
    onAdd,
    isPending,
}: Props) => {
  return (
    <div className="bg-white shadow-[0px_4px_0px_#3A3A3A] w-full p-4 rounded-xl border space-y-3">
        <div className="flex gap-3 items-center">
            <Avatar src={user.avatar} name={user.name} />
            <div className="flex flex-col gap-1 min-w-0">
                <span className="font-medium text-[#3A3A3A] truncate">{user.name ?? user.email}</span>
                <StatusBadge status={user.status} />
            </div>
        </div>
        <Button
            className={`${buttonClass} w-full flex items-center justify-center gap-1`}
            onClick={onAdd}
            disabled={isPending}
        >
            <Plus size={14} />
            Add friend
        </Button>
    </div>
  )
}

export default UserCard