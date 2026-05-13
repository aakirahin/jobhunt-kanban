import React from 'react'
import { 
    DialogTrigger,
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/app/_components/ui/dialog'
import InputGroups from './InputGroups'
import { Field, FieldLabel } from '../ui/field'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { buttonClass } from '@/lib/tailwindClasses'
import { ContractType, JobApplicationStatus, WorkArrangement } from '@/lib/generated/prisma/enums'
import RadioGroups from './RadioGroups'
import { Job as PrismaJob } from "@/lib/types"

type Props = {
    triggerButton: React.ReactNode
    handleJob: any
    open: boolean
    setOpen: (open: boolean) => void
    title: string
    job?: PrismaJob
}

type Job = {
    title: string
    company: string
    url: string
    location: string
    work_arrangement: WorkArrangement
    contract_type: ContractType
    application_status: JobApplicationStatus
    notes: string
}

const JobDialog = ({
    triggerButton,
    handleJob,
    open,
    setOpen,
    title,
    job
}: Props) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const newJob = Object.fromEntries(formData)
        handleJob({ 
            ...newJob, 
            id: job ? job.id : "" 
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerButton}
            </DialogTrigger>
            <DialogContent className="w-1/4 p-5 border">
                <DialogHeader>
                    <DialogTitle className='text-lg'>{title}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <InputGroups job={job}/>
                    {/* TODO IMPLEMENT GOOGLE MAPS AUTOCOMPLETE */}
                    {/* TODO ADD COMPANY SIZE + EMPLOYEES */}
                    <RadioGroups job={job}/>
                    <Field>
                        <FieldLabel htmlFor="notes">Notes</FieldLabel>
                        <Textarea id="notes" name="notes" defaultValue={job?.notes ?? ""}/>
                    </Field>
                    <Field orientation="horizontal" className='justify-end'>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" className={buttonClass}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" className={buttonClass}>
                            Save
                        </Button>
                    </Field>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default JobDialog