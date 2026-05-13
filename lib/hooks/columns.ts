"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { BoardColumn } from "../types"
import { useGuest } from "@/app/_context/guest"

export const useGetColumnsQuery = (initialColumns?: BoardColumn[]) => {
    const guest = useGuest()

    const { data: apiColumns = initialColumns } = useQuery<BoardColumn[]>({
        queryKey: ["columns"],
        queryFn: async () => {
            const res = await fetch("/api/columns")
            if (!res.ok) throw new Error("Failed to fetch columns")
            return res.json()
        },
        initialData: !guest ? initialColumns : undefined,
        staleTime: Infinity,
        enabled: !guest,
    })

    if (guest) return { columns: guest.columns }
    return { columns: apiColumns }
}

export const useEditColumnOrderMutation = () => {
    const guest = useGuest()

    const { mutate: apiEditColumnOrder } = useMutation({
        mutationFn: async (newColumnOrder: BoardColumn[]) => {
            return fetch('/api/columns', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ columnIds: newColumnOrder.map((column) => column.id) })
            }).then(res => res.json())
        }
    })

    if (guest) {
        return {
            editColumnOrder: (newColumnOrder: BoardColumn[]) => {
                guest.setColumns(newColumnOrder)
            }
        }
    }

    return { editColumnOrder: apiEditColumnOrder }
}