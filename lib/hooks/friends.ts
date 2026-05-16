"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { queryClient } from "@/app/providers"
import { toast } from "sonner"

export type FriendUser = {
    friendshipId: string
    id: string
    name: string | null
    email: string
    avatar: string | null
    status: string
}

export type FriendRequest = {
    id: string
    requester: FriendUser
    requested_at: string
}

export type FriendsData = {
    friends: FriendUser[]
    requests: FriendRequest[]
}

const clientOnly = typeof window !== "undefined"

export const useGetFriendsQuery = () =>
    useQuery({
        queryKey: ["friends"],
        queryFn: async (): Promise<FriendsData> => {
            const res = await fetch("/api/friends")
            if (!res.ok) throw new Error("Failed to load friends")
            return res.json()
        },
        enabled: clientOnly,
    })

export const useSearchUsersQuery = (query: string) =>
    useQuery({
        queryKey: ["friends", "search", query],
        queryFn: async (): Promise<FriendUser[]> => {
            const res = await fetch(`/api/friends?q=${encodeURIComponent(query)}`)
            if (!res.ok) throw new Error("Failed to search users")
            return res.json()
        },
        enabled: clientOnly,
    })

export const useSendFriendRequestMutation = () =>
    useMutation({
        mutationFn: async (addressee_id: string) => {
            const res = await fetch("/api/friends", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ addressee_id }),
            })
            if (!res.ok) throw new Error("Failed to send friend request")
            return res.json()
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["friends"] })
            toast.success(data.status === "ACCEPTED" ? "Friend added!" : "Friend request sent!")
        },
        onError: () => toast.error("Failed to send friend request"),
    })

export const useRemoveFriendMutation = () =>
    useMutation({
        mutationFn: async (friendshipId: string) => {
            const res = await fetch(`/api/friends/${friendshipId}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Failed to remove friend")
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["friends"] })
            toast.success("Friend removed")
        },
        onError: () => toast.error("Failed to remove friend"),
    })

export const useRespondFriendRequestMutation = () =>
    useMutation({
        mutationFn: async ({ id, status }: { id: string; status: "ACCEPTED" | "DECLINED" }) => {
            const res = await fetch(`/api/friends/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            })
            if (!res.ok) throw new Error("Failed to respond to request")
            return res.json()
        },
        onSuccess: (_, { status }) => {
            queryClient.invalidateQueries({ queryKey: ["friends"] })
            toast.success(status === "ACCEPTED" ? "Friend request accepted!" : "Request declined")
        },
        onError: () => toast.error("Failed to respond to request"),
    })
