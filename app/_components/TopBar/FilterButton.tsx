import { buttonClass } from "@/lib/tailwindClasses"
import { Button } from "../ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Job } from "@/lib/types"
import { Checkbox } from "../ui/checkbox"

type Props = {
    filter: {
        id: keyof Job
        label: string
        options: string[]
    }
    selectedValues: string[]
    onSelection: (values: string[]) => void
}

const FilterButton = ({
    filter,
    selectedValues,
    onSelection,
}: Props) => {
    const { id, label, options } = filter

    const toggle = (option: string) => {
        if (selectedValues.includes(option)) onSelection(selectedValues.filter((v) => v !== option))
        else onSelection([...selectedValues, option])
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={selectedValues.length > 0 ? "default" : "secondary"}
                    className={buttonClass}
                >
                    {label}{!!selectedValues.length && ` (${selectedValues.length})`}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-45 mt-2" align="end">
                <DropdownMenuLabel>{label}</DropdownMenuLabel>
                <DropdownMenuGroup>
                    {
                        options.map((o) => (
                            <DropdownMenuItem
                                key={`${id}_${o}`}
                                onSelect={(e) => e.preventDefault()}
                                onClick={() => toggle(o)}
                            >
                                <Checkbox checked={selectedValues.includes(o)} onCheckedChange={() => toggle(o)}/>
                                {o}
                            </DropdownMenuItem>
                        ))
                    }
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default FilterButton