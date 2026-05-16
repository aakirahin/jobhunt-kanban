import FilterButton from './FilterButton'
import DateFilterButton from './DateFilterButton'
import AddJob from '../JobDialog/AddJob'
import { Job } from '@/lib/types'
import { DateRange } from 'react-day-picker'
import GenerateJobReport from './GenerateJobReport'
import { Input } from '../ui/input'

type Props = {
    jobs: Job[]
    selections: Record<string, string[]>
    setSelections: (selections: Record<string, string[]>) => void
    dateRange: DateRange | undefined
    setDateRange: (dateRange: DateRange | undefined) => void
    search: string
    setSearch: (search: string) => void
}

type FilterDef = {
    id: keyof Job
    label: string
    options?: { id: string, label: string }[]
}

const filterDefs: FilterDef[] = [
    { 
        id: "title",
        label: "Job title",
    },
    { 
        id: "location",
        label: "Location",
    },
    { 
        id: "work_arrangement",
        label: "Work arrangement",
        options: ["Remote", "Hybrid", "Onsite"].map((wa) => ({
            id: wa.toUpperCase(),
            label: wa
        }))
    },
    { 
        id: "contract_type",
        label: "Contract type",
        options: ["Permanent", "Contract", "Freelance"].map((ct) => ({
            id: ct.toUpperCase(),
            label: ct
        }))
    },
]

const FilterBar = ({
    jobs,
    selections,
    setSelections,
    dateRange,
    setDateRange,
    search,
    setSearch
}: Props) => {
    const filters = filterDefs.map(({ id, label, options }) => ({
        id,
        label,
        options: options ? options : [...new Set(jobs.map((job) => (job[id])))]
            .map((v) => ({ id: v, label: v }))
            .filter((v) => v.id !== null && v.id !== "")
    }))

    const handleSelection = (filterId: string, values: string[]) => {
        setSelections({ ...selections, [filterId]: values })
    }

    return (
        <div className='flex justify-between'>
            <div className='flex items-center gap-4'>
                <Input 
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className='flex items-center gap-2'>
                    {
                        filters.map((filter) => (
                            <FilterButton
                                key={filter.id}
                                filter={filter}
                                selectedValues={selections[filter.id] ?? []}
                                onSelection={(values) => handleSelection(filter.id, values)}
                            />
                        ))
                    }
                    <DateFilterButton dateRange={dateRange} onDateRangeChange={setDateRange}/>
                </div>
            </div>
            <div className='flex gap-2'>
                <AddJob/>
                <GenerateJobReport jobCount={jobs.length}/>
            </div>
        </div>
    )
}

export default FilterBar