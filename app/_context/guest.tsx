"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { BoardColumn, Job } from "@/lib/types"

const GUEST_JOBS_KEY = "guest_jobs"
const GUEST_COLUMNS_KEY = "guest_columns"

const GUEST_DEFAULT_COLUMNS: BoardColumn[] = [
    { id: "guest-col-0", name: "Saved", position: 0, colour: "#A6BBFB" },
    { id: "guest-col-1", name: "Applied", position: 1, colour: "#99D1FB" },
    { id: "guest-col-2", name: "Interviewed", position: 2, colour: "#4FE7CD" },
    { id: "guest-col-3", name: "Accepted", position: 3, colour: "#95EC3F" },
    { id: "guest-col-4", name: "Rejected", position: 4, colour: "#FEAAC2" },
]

type GuestContextType = {
    isGuest: true
    jobs: Job[]
    setJobs: (jobs: Job[]) => void
    columns: BoardColumn[]
    setColumns: (columns: BoardColumn[]) => void
}

const GuestContext = createContext<GuestContextType | null>(null)

export const useGuest = () => useContext(GuestContext)

export const GuestProvider = ({ children }: { children: React.ReactNode }) => {
    const [hydrated, setHydrated] = useState(false)
    const [jobs, setJobsState] = useState<Job[]>([])
    const [columns, setColumnsState] = useState<BoardColumn[]>([])

    useEffect(() => {
        try {
            const stored = localStorage.getItem(GUEST_JOBS_KEY)
            setJobsState(stored ? JSON.parse(stored) : [])
        } catch {
            setJobsState([])
        }

        try {
            const stored = localStorage.getItem(GUEST_COLUMNS_KEY)
            setColumnsState(stored ? JSON.parse(stored) : GUEST_DEFAULT_COLUMNS)
        } catch {
            setColumnsState(GUEST_DEFAULT_COLUMNS)
        }

        setHydrated(true)
    }, [])

    const setJobs = (newJobs: Job[]) => {
        setJobsState(newJobs)

        try { 
            localStorage.setItem(GUEST_JOBS_KEY, JSON.stringify(newJobs)) 
        } catch {}
    }

    const setColumns = (newColumns: BoardColumn[]) => {
        setColumnsState(newColumns)

        try { 
            localStorage.setItem(GUEST_COLUMNS_KEY, JSON.stringify(newColumns)) 
        } catch {}
    }

    if (!hydrated) return null

    return (
        <GuestContext.Provider value={{ isGuest: true, jobs, columns, setJobs, setColumns }}>
            {children}
        </GuestContext.Provider>
    )
}
