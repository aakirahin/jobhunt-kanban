"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { Job } from "../types"
import { toast } from "sonner"
import { queryClient } from "@/app/providers"

export type JobFilters = {
    title?: string
    location?: string
    work_arrangement?: string
    contract_type?: string
    application_status?: string
    from?: Date | undefined
    to?: Date | undefined
}

export const useGetJobsQuery = (initialJobs: Job[] = [], filters: JobFilters = {}) => {
    const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([k, v]) => (v !== undefined && v !== ""))
    )
    const params = new URLSearchParams(activeFilters as Record<string, string>).toString()
    const url = params ? `/api/jobs?${params}` : "/api/jobs"

    const { data: jobs = initialJobs } = useQuery<Job[]>({
        queryKey: ["jobs", activeFilters],
        queryFn: async () => {
            const res = await fetch(url)
            if (!res.ok) toast.error("Failed to fetch jobs")
            return res.json()
        },
        initialData: Object.keys(activeFilters).length === 0 ? initialJobs : undefined,
        staleTime: 30_000,
    })

    return { jobs }
}

export const useCreateJobMutation = (setOpen: (open: boolean) => void) => {
    const { mutate: createJob } = useMutation({
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
            const previousJobs = queryClient.getQueryData<Job[]>(['jobs'])
            queryClient.setQueryData<Job[]>(['jobs'], (prev = []) => [...prev, newJob as unknown as Job])
            return { previousJobs }
        },
        onSuccess: () => {
            toast.success("New job successfully added!")
            setOpen(false)
        },
        onError: (_err, _newJob, context) => {
            queryClient.setQueryData<Job[]>(['jobs'], context?.previousJobs)
            toast.error("Something went wrong. Please try again later.")
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
        },
    })

    return { createJob }
}

export const useEditJobMutation = (setOpen: (open: boolean) => void) => {
    const { mutate: editJob } = useMutation({
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
            const previousJobs = queryClient.getQueryData<Job[]>(['jobs'])
            queryClient.setQueryData<Job[]>(['jobs'], (prev = []) => [...prev, updatedJob as unknown as Job])
            return { previousJobs }
        },
        onSuccess: () => {
            toast.success("Updated job successfully!")
            setOpen(false)
        },
        onError: (_err, _updatedJob, context) => {
            queryClient.setQueryData<Job[]>(['jobs'], context?.previousJobs)
            toast.error("Something went wrong. Please try again later.")
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
        },
    })

    return { editJob }
}

export const useDeleteJobsMutation = () => {
    const { mutate: deleteJob } = useMutation({
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
            const previousJobs = queryClient.getQueryData<Job[]>(['jobs'])
            queryClient.setQueryData<Job[]>(['jobs'], (prev = []) =>
                prev.filter((job) => job.id !== jobId)
            )
            return { previousJobs }
        },
        onSuccess: () => {
            toast.success("Job deleted successfully!")
        },
        onError: (_err, _jobId, context) => {
            queryClient.setQueryData<Job[]>(['jobs'], context?.previousJobs)
            toast.error("Something went wrong. Please try again later.")
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
        },
    })

    return { deleteJob }
}

export const useMoveJobMutation = () => {
    const { mutate: moveJob } = useMutation({
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
            const previousJobs = queryClient.getQueryData<Job[]>(['jobs'])
            queryClient.setQueryData<Job[]>(['jobs'], (prev = []) =>
                prev.map((job) =>
                    job.id === jobId ? { ...job, application_status: application_status as Job['application_status'] } : job
                )
            )
            return { previousJobs }
        },
        onError: (_err, _vars, context) => {
            queryClient.setQueryData(['jobs'], context?.previousJobs)
            toast.error("Failed to move job. Please try again.")
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] })
        },
    })

    return { moveJob }
}