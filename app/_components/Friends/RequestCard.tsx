import { FriendRequest } from '@/lib/hooks/friends'
import Avatar from './Avatar'
import StatusBadge from './StatusBadge'
import { Check, X } from 'lucide-react'
import { Button } from '../ui/button'

type Props = {
    request: FriendRequest
    onAccept: () => void
    onDecline: () => void
    isPending: boolean
}

const RequestCard = ({
    request,
    onAccept,
    onDecline,
    isPending,
}: Props) => {
  return (
        <div className="bg-white shadow-[0px_4px_0px_#3A3A3A] p-4 rounded-xl border flex items-center gap-3">
            <Avatar src={request.requester.avatar} name={request.requester.name} />
            <div className="flex flex-col gap-1 min-w-0 flex-1">
                <span className="font-medium text-[#3A3A3A] truncate">
                    {request.requester.name ?? request.requester.email}
                </span>
                <StatusBadge status={request.requester.status} />
            </div>
            <div className="flex gap-2 shrink-0">
                <Button
                    onClick={onAccept}
                    disabled={isPending}
                    className="w-8 h-8 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                    aria-label="Accept"
                >
                    <Check size={15} className="text-green-500" />
                </Button>
                <Button
                    onClick={onDecline}
                    disabled={isPending}
                    className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                    aria-label="Decline"
                >
                    <X size={15} className="text-red-500" />
                </Button>
            </div>
        </div>
    )
}

export default RequestCard