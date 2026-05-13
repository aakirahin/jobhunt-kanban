import { Job } from "@/lib/types"
import { MapPin, X } from "lucide-react"
import EditJob from "../JobDialog/EditJob"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

type Props = {
    job: Job
    handleDelete: (jobId: string) => void
    dragOverlay?: boolean
}

const pillClass = "py-1 px-2 rounded-full bg-gray-100 text-[11px] text-gray-500 font-medium border border-gray-300"
const secondaryText = "text-[13px] text-gray-500"

const JobCard = ({
    job,
    handleDelete,
    dragOverlay = false,
}: Props) => {
    const {
        title,
        company,
        url,
        location,
        work_arrangement,
        contract_type,
        notes,
        created_at
    } = job

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: job.id,
        data: { type: "card", job },
        disabled: dragOverlay,
    })

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Translate.toString(transform) }}
            className={`bg-white w-full border rounded-lg p-3 flex flex-col gap-1 cursor-grab ${isDragging ? "opacity-0" : ""}`}
            {...attributes}
            {...listeners}
        >
            <div className="flex justify-between">
                <div className="flex gap-1.5 items-center">
                    <span className="text-md font-medium">{title}</span>
                    <span className={`${secondaryText} font-medium`}>{company}</span>
                </div>
                <div className="flex gap-1 items-center" onPointerDown={(e) => e.stopPropagation()}>
                    <EditJob job={job}/>
                    <X
                        size={24}
                        className="cursor-pointer p-1 hover:bg-gray-200 rounded-md transition-all duration-200"
                        onClick={() => handleDelete(job.id)}
                    />
                </div>
            </div>
            <span className={`${secondaryText} font-medium flex items-center gap-0.5`}>
                <MapPin size={14}/>
                {location}
            </span>
            <span className={secondaryText}>{notes}</span>
            <span className={`${secondaryText} mb-1`}>{url}</span>
            <div className="flex justify-between items-center">
                <div className="flex gap-1.5 items-center">
                    <span className={pillClass}>{work_arrangement}</span>
                    <span className={pillClass}>{contract_type}</span>
                </div>
                {/* <span className={secondaryText}>{created_at.toLocaleDateString()}</span> */}
            </div>
        </div>
    )
}

export default JobCard
