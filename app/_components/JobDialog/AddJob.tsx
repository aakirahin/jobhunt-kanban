"use client"

import { Plus } from 'lucide-react'
import { Button } from '../ui/button'
import { buttonClass } from '@/lib/tailwindClasses'
import { useState } from 'react'
import { useCreateJobMutation } from '@/lib/hooks/jobs'
import JobDialog from './JobDialog'

const AddJob = () => {
    const [open, setOpen] = useState<boolean>(false)
    const { createJob } = useCreateJobMutation(setOpen)

    return (
        <JobDialog
            triggerButton={
                <Button variant="default" className={`flex gap-1 items-center ${buttonClass}`}>
                    <Plus size={20}/>
                    Add job
                </Button>
            }
            handleJob={createJob}
            open={open}
            setOpen={setOpen}
            title={"Add job"}
        />
    )
}

export default AddJob