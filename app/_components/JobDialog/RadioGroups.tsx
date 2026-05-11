import { Job } from "@/lib/types"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { useGetColumnsQuery } from "@/lib/hooks/columns"

type Props = {
    job?: Job
}

type RadioOption = {
    id: string
    label: string
}

type Radio = {
    id: keyof Job
    label: string
    default: string
    options: RadioOption[]
}

const RadioGroups = ({
    job
}: Props) => {
    const { columns = [] } = useGetColumnsQuery()
    
    // TODO: ADD COMPANY SIZE
    const radios: Radio[] = [
        {
            id: "work_arrangement",
            label: "Work arrangment",
            default: "REMOTE",
            options: [
                {
                    id: "REMOTE",
                    label: "Remote"
                },
                {
                    id: "HYBRID",
                    label: "Hybrid"
                },
                {
                    id: "ONSITE",
                    label: "On-site"
                },
            ],
        },
        {
            id: "contract_type",
            label: "Contract type",
            default: "PERMANENT",
            options: [
                {
                    id: "PERMANENT",
                    label: "Permanent"
                },
                {
                    id: "CONTRACT",
                    label: "Contract"
                },
                {
                    id: "FREELANCE",
                    label: "Freelance"
                },
            ],
        },
        {
            id: "application_status",
            label: "Application status",
            default: "SAVED",
            options: [
                {
                    id: "SAVED",
                    label: "Saved"
                },
                {
                    id: "APPLIED",
                    label: "Applied"
                },
                {
                    id: "INTERVIEWED",
                    label: "Interviewed"
                },
                {
                    id: "ACCEPTED",
                    label: "Accepted"
                },
                {
                    id: "REJECTED",
                    label: "Rejected"
                },
            ]
        },
    ]

    return radios.map((radio) => (
        <RadioGroup 
            defaultValue={job ? job[radio.id] as string : radio.default} 
            key={radio.id} 
            name={radio.id}
            className='mt-2'
        >
            <Label htmlFor={radio.id}>{radio.label}</Label>
            <div className='flex flex-wrap gap-y-4 gap-x-6 mt-2'>
                {
                    radio.options.map((option) => (
                        <div className="flex items-center gap-2" key={option.id}>
                            <RadioGroupItem value={option.id} id={option.id} className='cursor-pointer'/>
                            <Label htmlFor={option.id}>{option.label}</Label>
                        </div>
                    ))
                }
            </div>
        </RadioGroup>
    ))
}

export default RadioGroups