"use client"

import { useMemo, useState } from "react"
import { BoardColumn, Job } from "@/lib/types"
import FilterBar from "../TopBar/FilterBar"
import { useGetJobsQuery } from "@/lib/hooks/jobs"
import { DateRange } from "react-day-picker"
import KanbanBoard from "./KanbanBoard"
import useDebounce from "@/lib/hooks/useDebounce"

type Props = {
    initialColumns: BoardColumn[]
    initialJobs: Job[]
}

const Board = ({ 
    initialColumns,
    initialJobs
}: Props) => {
    const [search, setSearch] = useState<string>("")
    const [selections, setSelections] = useState<Record<string, string[]>>({})
    const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: undefined, to: undefined })
    const debouncedSearch = useDebounce(search, 1000)
    const { jobs = initialJobs } = useGetJobsQuery(initialJobs, { search: debouncedSearch, ...selections, ...dateRange })

    const columnJobs = useMemo(() => {
        const categorised: { [key: string]: Job[] } = {}
        jobs.forEach((job: Job) => {
            const status = job.application_status
            if (categorised[status]) categorised[status].push(job)
            else categorised[status] = [job]
        })
        return categorised
    }, [jobs])

    return (
        <div className="flex flex-col gap-4">
            <FilterBar 
                jobs={jobs}
                {...{
                    selections,
                    setSelections,
                    dateRange,
                    setDateRange,
                    search,
                    setSearch
                }}
            />
            <KanbanBoard initialColumns={initialColumns} columnJobs={columnJobs}/>
        </div>
    )
}

export default Board