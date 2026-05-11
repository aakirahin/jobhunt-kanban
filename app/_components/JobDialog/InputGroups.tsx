import { Field, FieldGroup } from '../ui/field'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { inputClass } from '@/lib/tailwindClasses'
import { Job } from '@/lib/types'

type Props = {
    job?: Job
}

type Input = {
    id: keyof Job
    label: string
    type: string
    required: boolean
}

const InputGroups = ({
    job
}: Props) => {
    const inputs: Input[] = [
        {
            id: "title",
            label: "Job title",
            type: "text",
            required: true
        },
        {
            id: "company",
            label: "Company",
            type: "text",
            required: true
        },
        {
            id: "url",
            label: "Job listing URL",
            type: "text",
            required: false
        },
        {
            id: "location",
            label: "Location",
            type: "text",
            required: true
        },
    ]

    return (
        <FieldGroup className='grid grid-cols-2'>
            {
                inputs.map((input) => (
                    <Field key={input.id}>
                        <Label htmlFor={input.id}>{input.label}</Label>
                        <Input 
                            id={input.id} 
                            name={input.id} 
                            className={inputClass} 
                            required={input.required}
                            defaultValue={job?.[input.id] as string ?? ""}
                        />
                    </Field>
                ))
            }
        </FieldGroup>
    )
}

export default InputGroups