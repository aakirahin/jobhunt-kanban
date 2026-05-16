import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { computeStats } from "@/lib/reportUtils"
import { Job } from "@/lib/types"
import { toast } from "sonner"
import StatCard from "@/app/_components/JobReport/StatCard"
import ReportCard from "@/app/_components/JobReport/ReportCard"
import BreakdownBar from "@/app/_components/JobReport/BreakdownBar"
import WeeklyChart from "@/app/_components/JobReport/WeeklyChart"
import AISummary from "@/app/_components/JobReport/AISummary"

export const dynamic = "force-dynamic"

const THRESHOLD = 10

const STATUS_LABELS: Record<string, string> = {
    SAVED: "Saved", 
    APPLIED: "Applied", 
    INTERVIEWED: "Interviewed",
    ACCEPTED: "Accepted", 
    REJECTED: "Rejected"
}
const STATUS_COLORS: Record<string, string> = {
    SAVED: "#A6BBFB", 
    APPLIED: "#99D1FB", 
    INTERVIEWED: "#4FE7CD",
    ACCEPTED: "#95EC3F", 
    REJECTED: "#FEAAC2"
}
const ARRANGEMENT_LABELS: Record<string, string> = { 
    REMOTE: "Remote", 
    HYBRID: "Hybrid", 
    ONSITE: "On-site" 
}
const CONTRACT_LABELS: Record<string, string> = { 
    PERMANENT: "Permanent", 
    CONTRACT: "Contract", 
    FREELANCE: "Freelance" 
}
const PALETTE = ["#A6BBFB", "#4FE7CD", "#95EC3F", "#FEAAC2", "#FFF987"]

type Props = { 
    params: Promise<{ userId: string }> 
}

export default async function ReportPage({ params }: Props) {
    const { userId } = await params

    const jobs = await prisma.job.findMany({
        where: { user_id: userId },
        orderBy: { created_at: "asc" },
    })

    if (jobs.length < THRESHOLD) {
        toast.error("You have not applied to enough jobs to generate a report yet.")
        redirect(`/user/${userId}`)
    }

    const stats = computeStats(jobs as Job[])

    return (
        <div className="flex flex-col gap-6 pb-8">
            <div className="grid grid-cols-4 gap-4">
                <StatCard label="Total Applications" value={stats.total.toString()} />
                <StatCard label="Response Rate" value={`${Math.round(stats.response_rate * 100)}%`} />
                <StatCard label="Interview Rate" value={`${Math.round(stats.interview_rate * 100)}%`} />
                <StatCard label="Offer Rate" value={`${Math.round(stats.offer_rate * 100)}%`} />
            </div>
            <ReportCard title="Application Status">
                <BreakdownBar
                    data={stats.by_status}
                    total={stats.total}
                    labelMap={STATUS_LABELS}
                    colorMap={STATUS_COLORS}
                />
            </ReportCard>
            <div className="grid grid-cols-2 gap-4">
                <ReportCard title="Work Arrangement">
                    <BreakdownBar
                        data={stats.by_work_arrangement}
                        total={stats.total}
                        labelMap={ARRANGEMENT_LABELS}
                        defaultColors={PALETTE}
                    />
                </ReportCard>
                <ReportCard title="Contract Type">
                    <BreakdownBar
                        data={stats.by_contract_type}
                        total={stats.total}
                        labelMap={CONTRACT_LABELS}
                        defaultColors={PALETTE}
                    />
                </ReportCard>
            </div>
            {stats.applications_per_week.length > 1 && (
                <ReportCard title="Applications per Week">
                    <WeeklyChart data={stats.applications_per_week} />
                </ReportCard>
            )}
            <AISummary stats={stats} />
        </div>
    )
}
