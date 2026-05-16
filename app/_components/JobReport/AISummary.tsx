"use client"

import { useGetAISummaryQuery } from "@/lib/hooks/report"
import { ReportStats } from "@/lib/reportUtils"
import { Sparkles } from "lucide-react"

type Props = { 
    stats: ReportStats 
}

export default function AISummary({ stats }: Props) {
    const { summary, isPending, error } = useGetAISummaryQuery(stats)

    return (
        <SummaryCard>
            {
                isPending &&
                <div className="animate-pulse flex flex-col gap-2">
                    <div className="h-4 bg-gray-100 rounded w-full" />
                    <div className="h-4 bg-gray-100 rounded w-4/5" />
                    <div className="h-4 bg-gray-100 rounded w-3/5" />
                </div>
            }
            {error && <p className="text-sm text-gray-600 leading-relaxed">{error.message}</p>}
            {summary && <p className="text-sm text-gray-600 leading-relaxed">{summary}</p>}
        </SummaryCard>
    )
}

const SummaryCard = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-white rounded-xl border shadow-[0px_4px_0px_#3A3A3A] p-5">
        <div className="flex items-center gap-1.5 mb-3">
            <Sparkles size={14} color='#C68CFF' />
            <h2 className="font-semibold text-[#3A3A3A]">AI Summary</h2>
        </div>
        {children}
    </div>
)

export const AISummaryLoading = () => (
    <SummaryCard>
        <div className="animate-pulse flex flex-col gap-2">
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-4/5" />
            <div className="h-4 bg-gray-100 rounded w-3/5" />
        </div>
    </SummaryCard>
)
