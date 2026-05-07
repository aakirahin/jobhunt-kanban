import { Button } from './ui/button'
import { Plus, Sparkles } from 'lucide-react'
import { buttonClass } from '@/lib/tailwindClasses'
import FilterButton from './FilterButton'

type Props = {}

const filters = [
    {
        id: "job_title",
        label: "Job title",
        options: []
    },
    {
        id: "company_size",
        label: "Company size",
        options: []
    },
    {
        id: "location",
        label: "Location",
        options: []
    },
    {
        id: "tags",
        label: "Tags",
        options: []
    },
    {
        id: "date",
        label: "Date",
        options: []
    },
]


// TODO ADD FUNCTIONS
const FilterBar = (props: Props) => {
  return (
    <div className='flex justify-between'>
        <div className='flex items-center gap-2'>
            <span className='text-sm font-medium'>Filter by:</span>
            {
                filters.map((filter) => (
                    <FilterButton 
                        key={filter.id}
                        filter={filter}
                    />
                ))
            }
        </div>
        <div className='flex gap-2'>
            <Button className={`bg-[#FFF987] rounded-full flex gap-1 items-center ${buttonClass}`}>
                <Plus size={20}/>
                Add job
            </Button>
            <Button className={`bg-linear-to-r from-blue-400 to-purple-400 text-white rounded-full flex gap-1 items-center ${buttonClass}`}>
                <Sparkles size={20}/>
                Generate job report
            </Button>
        </div>
    </div>
  )
}

export default FilterBar