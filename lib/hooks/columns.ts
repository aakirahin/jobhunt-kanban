"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { BoardColumn } from "../types"

export const useGetColumnsQuery = (initialColumns?: BoardColumn[]) => {
    const { data: columns = initialColumns } = useQuery<BoardColumn[]>({
        queryKey: ["columns"],
        queryFn: async () => {
            const res = await fetch("/api/columns")
            if (!res.ok) throw new Error("Failed to fetch columns")
            return res.json()
        },
        initialData: initialColumns,
        staleTime: Infinity,
    })

    return { columns }
}

export const useEditColumnOrderMutation = () => {
    const { mutate: editColumnOrder } = useMutation({
        mutationFn: async (newColumnOrder: BoardColumn[]) => {
            return fetch('/api/columns', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ columnIds: newColumnOrder.map((column) => column.id) })
            }).then(res => res.json())
        }
    })

    return { editColumnOrder }
}