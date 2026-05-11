import { BoardColumn, Job } from '@/lib/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Column from './Column'

type Props = {
    column: BoardColumn
    columnJobs: { [key: string]: Job[] }
    isOver?: boolean
}

const SortableColumn = ({
    column,
    columnJobs,
    isOver = false,
}: Props) => {
    const { 
        attributes, 
        listeners, 
        setNodeRef, 
        transform, 
        transition, 
        isDragging 
    } = useSortable({
        id: column.id,
        data: { type: 'column' },
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
    }

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className="w-full"
        >
            <Column 
                key={column.id}
                column={column} 
                columnJobs={columnJobs}
                dragHandleAttributes={attributes}
                dragHandleListeners={listeners}
                isOver={isOver}
            />
        </div>
    )
}

export default SortableColumn