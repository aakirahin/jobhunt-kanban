"use client"

import { PencilIcon } from 'lucide-react'
import { useState } from 'react'
import JobDialog from './JobDialog'
import { useEditJobMutation } from '@/lib/hooks/jobs'
import { Job } from '@/lib/types'

type Props = {
    job: Job
}

const EditJob = ({
    job
}: Props) => {
    const [open, setOpen] = useState<boolean>(false)
    const { editJob } = useEditJobMutation(setOpen)

    return (
        <JobDialog
            triggerButton={
                <PencilIcon 
                    size={24}
                    className='cursor-pointer p-1 hover:bg-gray-200 rounded-md transition-all duration-200' 
                />
            }
            handleJob={editJob}
            open={open}
            setOpen={setOpen}
            title={"Edit job"}
            job={job}
        />
    )
}

export default EditJob