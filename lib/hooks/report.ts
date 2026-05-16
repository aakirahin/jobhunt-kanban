"use client"

import { useQuery } from "@tanstack/react-query"
import { ReportStats } from "../reportUtils"

const fetchAISummary = async (stats: ReportStats): Promise<string> => {
    const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stats),
    })

    if (!res.ok) throw new Error("Failed to fetch AI summary.")

    const { summary } = await res.json()
    return summary
}

export const useGetAISummaryQuery = (stats: ReportStats) => {
    const { data: summary, isPending, error } = useQuery({
        queryKey: ["report"],
        queryFn: () => fetchAISummary(stats),
        enabled: typeof window !== "undefined",
        retry: false,
    })

    return { summary, isPending, error }
}