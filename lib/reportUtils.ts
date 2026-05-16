import { Job } from "./types"

export type WeeklyCount = { week: string; count: number }

export type ReportStats = {
    total: number
    // Responded = heard back at all (INTERVIEWED + ACCEPTED + REJECTED)
    response_rate: number
    // Interviewed = made it to interview stage (INTERVIEWED + ACCEPTED)
    interview_rate: number
    // Accepted = received an offer (ACCEPTED)
    offer_rate: number
    by_status: Record<string, number>
    by_work_arrangement: Record<string, number>
    by_contract_type: Record<string, number>
    applications_per_week: WeeklyCount[]
}

export const computeStats = (jobs: Job[]): ReportStats => {
    const total = jobs.length

    const by_status: Record<string, number> = {}
    const by_work_arrangement: Record<string, number> = {}
    const by_contract_type: Record<string, number> = {}
    const weekMap: Record<string, number> = {}

    for (const job of jobs) {
        by_status[job.application_status] = (by_status[job.application_status] ?? 0) + 1

        if (job.work_arrangement) by_work_arrangement[job.work_arrangement] = (by_work_arrangement[job.work_arrangement] ?? 0) + 1
        if (job.contract_type) by_contract_type[job.contract_type] = (by_contract_type[job.contract_type] ?? 0) + 1

        const date = new Date(job.created_at)
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        const weekKey = weekStart.toISOString().split("T")[0]
        weekMap[weekKey] = (weekMap[weekKey] ?? 0) + 1
    }

    const responded = (by_status["INTERVIEWED"] ?? 0) + (by_status["ACCEPTED"] ?? 0) + (by_status["REJECTED"] ?? 0)
    const interviewed = (by_status["INTERVIEWED"] ?? 0) + (by_status["ACCEPTED"] ?? 0)
    const accepted = by_status["ACCEPTED"] ?? 0

    const applications_per_week = Object.entries(weekMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-12)
        .map(([week, count]) => ({ week, count }))

    return {
        total,
        response_rate: total ? responded / total : 0,
        interview_rate: total ? interviewed / total : 0,
        offer_rate: total ? accepted / total : 0,
        by_status,
        by_work_arrangement,
        by_contract_type,
        applications_per_week,
    }
}
