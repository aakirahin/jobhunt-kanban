"use client"

import { useState } from "react"
import { Input } from "@/app/_components/ui/input"
import useDebounce from "@/lib/hooks/useDebounce"
import { useAuth } from "@/app/_context/authentication"
import {
    useGetFriendsQuery,
    useSearchUsersQuery,
    useSendFriendRequestMutation,
    useRespondFriendRequestMutation,
    useRemoveFriendMutation,
} from "@/lib/hooks/friends"
import UserCard from "./UserCard"
import FriendCard from "./FriendCard"
import RequestCard from "./RequestCard"
import { Separator } from "../ui/separator"

export default function FriendsClient() {
    const [query, setQuery] = useState("")
    const debouncedQuery = useDebounce(query, 400)
    const { user } = useAuth()

    const { data: friendsData } = useGetFriendsQuery()
    const { data: searchResults, isFetching: isSearching } = useSearchUsersQuery(debouncedQuery)

    const sendRequest = useSendFriendRequestMutation()
    const respondRequest = useRespondFriendRequestMutation()
    const removeFriend = useRemoveFriendMutation()

    const friends = friendsData?.friends ?? []
    const requests = friendsData?.requests ?? []
    const suggestions = searchResults ?? []

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="font-medium text-lg">Find your friends</h3>
                <Input
                    placeholder="Search by name or email…"
                    className="bg-white"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <h3 className="font-medium text-lg">Suggested accounts</h3>
                {
                    suggestions.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {
                                suggestions.map((user) => (
                                    <UserCard
                                        key={user.id}
                                        user={user}
                                        onAdd={() => sendRequest.mutate(user.id)}
                                        isPending={sendRequest.isPending}
                                    />
                                ))
                            }
                        </div>
                    )
                }
                {
                    suggestions.length === 0 && !isSearching && debouncedQuery.length > 0 && (
                        <p className="text-sm text-[#3A3A3A]">No users found for "{debouncedQuery}"</p>
                    )
                }
            </div>
            <Separator className="mt-8"/>
            <div className="space-y-2">
                <h3 className="font-medium text-lg">Your friends</h3>
                {
                    friends.length === 0 ? 
                    <p className="text-sm text-gray-400">Start adding some friends!</p> :
                    <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                        {
                            friends.map((friend) => (
                                <FriendCard
                                    key={friend.id}
                                    user={friend}
                                    userId={user?.id ?? ""}
                                    onRemove={() => removeFriend.mutate(friend.friendshipId)}
                                    isRemoving={removeFriend.isPending}
                                />
                            ))
                        }
                    </div>
                }
            </div>
            <div className="space-y-2">
                <h3 className="font-medium text-lg">Friend requests</h3>
                {
                    requests.length === 0 ?
                    <p className="text-sm text-gray-400">Nothing here.</p> : 
                    <div className="flex flex-col gap-2 max-w-md">
                        {requests.map((req) => (
                            <RequestCard
                                key={req.id}
                                request={req}
                                onAccept={() => respondRequest.mutate({ id: req.id, status: "ACCEPTED" })}
                                onDecline={() => respondRequest.mutate({ id: req.id, status: "DECLINED" })}
                                isPending={respondRequest.isPending}
                            />
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}
