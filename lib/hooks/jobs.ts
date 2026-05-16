"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { Job } from "../types"
import { toast } from "sonner"
import { queryClient } from "@/app/providers"
import { useGuest } from "@/app/_context/guest"

export type JobFilters = {
    search: string
    title?: string[]
    company?: string[]
    location?: string[]
    work_arrangement?: string[]
    contract_type?: string[]
    from?: Date | undefined
    to?: Date | undefined
}

const applyGuestFilters = (jobs: Job[], filters: JobFilters): Job[] =>
    jobs.filter((job) => {
        const { 
            search,
            title, 
            company,
            location, 
            work_arrangement, 
            contract_type, 
            from, 
            to 
        } = filters

        if (search && (!job.title.toLowerCase().includes(search.toLowerCase().trim()) && !job.company.toLowerCase().includes(search.toLowerCase().trim()))) return false
        if (title && !title.includes(job.title)) return false
        if (company && !company.includes(job.company)) return false
        if (location && !location.includes(job.location)) return false
        if (work_arrangement && !work_arrangement.includes(job.work_arrangement)) return false
        if (contract_type && !contract_type.includes(job.contract_type)) return false
        if (from && new Date(job.created_at) < from) return false
        if (to && new Date(job.created_at) > to) return false
        return true
    })

export const useGetJobsQuery = (initialJobs: Job[] = [], filters: JobFilters = {}) => {
    const guest = useGuest()
    const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([k, v]) => (v !== undefined && v.length > 0))
    )
    const params = new URLSearchParams(activeFilters).toString()
    const url = params ? `/api/jobs?${params}` : "/api/jobs"

    const { data: apiJobs = initialJobs } = useQuery<Job[]>({
        queryKey: ["jobs", activeFilters],
        queryFn: async () => {
            const res = await fetch(url)
            if (!res.ok) toast.error("Failed to fetch jobs")
            return res.json()
        },
        initialData: !guest && Object.keys(activeFilters).length === 0 ? initialJobs : undefined,
        staleTime: 30_000,
        enabled: !guest,
    })

    if (guest) return { jobs: applyGuestFilters(guest.jobs, activeFilters) }
    return { jobs: apiJobs }
}

export const useCreateJobMutation = (setOpen: (open: boolean) => void) => {
    const guest = useGuest()

    const { mutate: apiCreateJob } = useMutation({
        mutationKey: ["jobs"],
        mutationFn: async (newJob: Job) => {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newJob)
            })
            // if (!res.ok) toast.error("Failed to create job.")
            return res.json()
        },
        onMutate: async (newJob: Job) => {
            await queryClient.cancelQueries({ queryKey: ['jobs'] })
            const previousData = queryClient.getQueriesData<Job[]>({ queryKey: ['jobs'] })
            queryClient.setQueriesData<Job[]>({ queryKey: ['jobs'] }, (prev = []) => [...prev, newJob as unknown as Job])
            return { previousData }
        },
        onSuccess: () => {
            toast.success("New job successfully added!")
            setOpen(false)
        },
        onError: (_err, _newJob, context) => {
            context?.previousData.forEach(([key, data]) => queryClient.setQueryData(key, data))
            toast.error("Something went wrong. Please try again later.")
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
        },
    })

    if (guest) {
        return {
            createJob: (newJob: Job) => {
                const now = new Date()
                const jobWithId: Job = { ...newJob, id: crypto.randomUUID(), created_at: now, updated_at: now }
                guest.setJobs([...guest.jobs, jobWithId])
                toast.success("New job successfully added!")
                setOpen(false)
            }
        }
    }

    return { createJob: apiCreateJob }
}

export const useEditJobMutation = (setOpen: (open: boolean) => void) => {
    const guest = useGuest()

    const { mutate: apiEditJob } = useMutation({
        mutationKey: ["jobs"],
        mutationFn: async (updatedJob: Job) => {
            const res = await fetch(`/api/jobs/${updatedJob.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedJob)
            })
            // if (!res.ok) toast.error("Failed to update job.")
            return res.json()
        },
        onMutate: async (updatedJob: Job) => {
            await queryClient.cancelQueries({ queryKey: ['jobs'] })
            const previousData = queryClient.getQueriesData<Job[]>({ queryKey: ['jobs'] })
            queryClient.setQueriesData<Job[]>({ queryKey: ['jobs'] }, (prev = []) =>
                prev.map((job) => job.id === updatedJob.id ? { ...job, ...updatedJob } : job)
            )
            return { previousData }
        },
        onSuccess: () => {
            toast.success("Updated job successfully!")
            setOpen(false)
        },
        onError: (_err, _updatedJob, context) => {
            context?.previousData.forEach(([key, data]) => queryClient.setQueryData(key, data))
            toast.error("Something went wrong. Please try again later.")
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
        },
    })

    if (guest) {
        return {
            editJob: (updatedJob: Job) => {
                guest.setJobs(
                    guest.jobs.map((job) =>
                        job.id === updatedJob.id ? { ...job, ...updatedJob, updated_at: new Date() } : job
                    )
                )
                toast.success("Updated job successfully!")
                setOpen(false)
            }
        }
    }

    return { editJob: apiEditJob }
}

export const useDeleteJobsMutation = () => {
    const guest = useGuest()

    const { mutate: apiDeleteJob } = useMutation({
        mutationKey: ["jobs"],
        mutationFn: async (jobId: string) => {
            const res = await fetch('/api/jobs', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId })
            })
            // if (!res.ok) toast.error("Failed to create job.")
            return res.json()
        },
        onMutate: async (jobId: string) => {
            await queryClient.cancelQueries({ queryKey: ['jobs'] })
            const previousData = queryClient.getQueriesData<Job[]>({ queryKey: ['jobs'] })
            queryClient.setQueriesData<Job[]>({ queryKey: ['jobs'] }, (prev = []) =>
                prev.filter((job) => job.id !== jobId)
            )
            return { previousData }
        },
        onSuccess: () => {
            toast.success("Job deleted successfully!")
        },
        onError: (_err, _jobId, context) => {
            context?.previousData.forEach(([key, data]) => queryClient.setQueryData(key, data))
            toast.error("Something went wrong. Please try again later.")
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
        },
    })

    if (guest) {
        return {
            deleteJob: (jobId: string) => {
                guest.setJobs(guest.jobs.filter((job) => job.id !== jobId))
                toast.success("Job deleted successfully!")
            }
        }
    }

    return { deleteJob: apiDeleteJob }
}

export const useMoveJobMutation = () => {
    const guest = useGuest()

    const { mutate: apiMoveJob } = useMutation({
        mutationFn: async ({ jobId, application_status }: { jobId: string; application_status: string }) => {
            const res = await fetch(`/api/jobs/${jobId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: jobId, application_status }),
            })
            if (!res.ok) throw new Error("Failed to move job")
            return res.json()
        },
        onMutate: async ({ jobId, application_status }) => {
            await queryClient.cancelQueries({ queryKey: ['jobs'] })
            const previousData = queryClient.getQueriesData<Job[]>({ queryKey: ['jobs'] })
            queryClient.setQueriesData<Job[]>({ queryKey: ['jobs'] }, (prev = []) =>
                prev.map((job) =>
                    job.id === jobId ? { ...job, application_status: application_status as Job['application_status'] } : job
                )
            )
            return { previousData }
        },
        onError: (_err, _vars, context) => {
            context?.previousData.forEach(([key, data]) => {
                queryClient.setQueryData(key, data)
            })
            toast.error("Failed to move job. Please try again.")
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
        },
    })

    if (guest) {
        return {
            moveJob: ({ jobId, application_status }: { jobId: string; application_status: string }) => {
                guest.setJobs(
                    guest.jobs.map((job) =>
                        job.id === jobId
                            ? { ...job, application_status: application_status as Job['application_status'] }
                            : job
                    )
                )
            }
        }
    }

    return { moveJob: apiMoveJob }
}