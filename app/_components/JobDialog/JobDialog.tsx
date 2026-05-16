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
import { buttonClass, inputClass } from '@/lib/tailwindClasses'
import RadioGroups from './RadioGroups'
import { Job as PrismaJob } from "@/lib/types"
import { Label } from '../ui/label'
import { Input } from '../ui/input'

type Props = {
    triggerButton: React.ReactNode
    handleJob: any
    open: boolean
    setOpen: (open: boolean) => void
    title: string
    job?: PrismaJob
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
                    <Field key="title">
                        <Label htmlFor="title">Job title</Label>
                        <Input 
                            id="title" 
                            name="title" 
                            className={inputClass} 
                            required
                            defaultValue={job?.title as string ?? ""}
                        />
                    </Field>
                    <InputGroups job={job}/>
                    {/* TODO IMPLEMENT GOOGLE MAPS AUTOCOMPLETE */}
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