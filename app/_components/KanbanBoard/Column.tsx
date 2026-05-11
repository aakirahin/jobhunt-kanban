import { BoardColumn, Job } from '@/lib/types'
import { useDeleteJobsMutation } from '@/lib/hooks/jobs'
import JobCard from './JobCard'
import { GripVertical } from 'lucide-react'
import { DraggableAttributes } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'

type Props = {
    column: BoardColumn
    columnJobs: { [key: string]: Job[] }
    dragHandleAttributes?: DraggableAttributes
    dragHandleListeners?: SyntheticListenerMap
    isOver?: boolean
}

const Column = ({
    column,
    columnJobs,
    dragHandleAttributes,
    dragHandleListeners,
    isOver = false,
}: Props) => {
    const { name, colour } = column
    const jobs = columnJobs[column.name.toUpperCase()] ?? []
    const { deleteJob } = useDeleteJobsMutation()

    const handleDelete = async (jobId: string) => {
        deleteJob(jobId)
    }

    return (
        <div 
            className="w-full shadow-[0px_6px_0px_#3A3A3A] rounded-xl border border-[#3A3A3A] py-3 px-4" 
            style={{ backgroundColor: colour }}
        >
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                    {name} ({jobs.length})
                </h3>
                <GripVertical 
                    size={24} 
                    className='p-1 rounded-md hover:bg-[#3A3A3A20] transition-all duration-200 cursor-grab touch-none' 
                    {...dragHandleAttributes} 
                    {...dragHandleListeners}
                />
            </div>
            {
                !!jobs.length &&
                <div className='flex flex-col gap-3 my-3'>
                    {
                        jobs.map((job) => (
                            <JobCard 
                                key={job.id ?? job.company} 
                                job={job}
                                handleDelete={handleDelete}
                            />
                        ))
                    }
                </div>
            }
            <div className="transition-all duration-200 overflow-hidden" style={{ height: isOver ? '120px' : '0px' }} />
        </div>
    )
}

export default Column