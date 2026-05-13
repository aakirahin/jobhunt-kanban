"use client"

import { useMemo, useState } from "react"
import {
    DndContext,
    DragStartEvent,
    DragEndEvent,    
    DragOverlay,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import {
    SortableContext,
    arrayMove,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable"
import { BoardColumn, Job } from "@/lib/types"
import SortableColumn from "./SortableColumn"
import { useEditColumnOrderMutation } from "@/lib/hooks/columns"
import { useMoveJobMutation } from "@/lib/hooks/jobs"
import JobCard from "./JobCard"

type Props = {
    initialColumns: BoardColumn[]
    columnJobs: { [key: string]: Job[] }
}

const KanbanBoard = ({
    initialColumns,
    columnJobs
}: Props) => {
    const { editColumnOrder } = useEditColumnOrderMutation()
    const { moveJob } = useMoveJobMutation()
    const [boardColumns, setBoardColumns] = useState<BoardColumn[]>(
        [...initialColumns].sort((a, b) => a.position - b.position),
    )
    const columnIds = useMemo(() => boardColumns.map((column) => column.id), [boardColumns])
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

    const [activeJob, setActiveJob] = useState<Job | null>(null)
    const [overColumnId, setOverColumnId] = useState<string | null>(null)

    const handleDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === 'card') {
            setActiveJob(event.active.data.current.job as Job)
        }
    }

    const handleDragOver = (event: import("@dnd-kit/core").DragOverEvent) => {
        const { active, over } = event
        if (active.data.current?.type === 'card' && over) {
            setOverColumnId(over.id as string)
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        setActiveJob(null)
        setOverColumnId(null)

        if (!over || active.id === over.id) return

        const activeType = active.data.current?.type

        if (activeType === 'card') {
            const targetColumn = boardColumns.find((col) => col.id === over.id)
            if (!targetColumn) return
            const newStatus = targetColumn.name.toUpperCase()
            const job = active.data.current?.job as Job
            if (job.application_status === newStatus) return
            moveJob({ jobId: job.id, application_status: newStatus })
            return
        }

        // column reorder
        const oldIndex = boardColumns.findIndex((column) => column.id === active.id)
        const newIndex = boardColumns.findIndex((column) => column.id === over.id)

        if (oldIndex < 0 || newIndex < 0) return

        const previous = boardColumns
        const moved = arrayMove(boardColumns, oldIndex, newIndex).map((column, index) => ({
            ...column,
            position: index,
        }))

        setBoardColumns(moved)

        try {
            editColumnOrder(moved)
        } 
        catch {
            setBoardColumns(previous)
        }
    }

    return (
        <DndContext 
            id="columns-board-dnd"
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                <div className="flex gap-4">
                    {
                        boardColumns.map((column) => (
                            <SortableColumn 
                                key={column.id} 
                                column={column}
                                columnJobs={columnJobs}
                                isOver={overColumnId === column.id}
                            />
                        ))
                    }
                </div>
            </SortableContext>
            <DragOverlay>
                {
                    activeJob && (
                        <JobCard
                            job={activeJob}
                            handleDelete={() => {}}
                            dragOverlay
                        />
                    )
                }
            </DragOverlay>
        </DndContext>
    )
}

export default KanbanBoard