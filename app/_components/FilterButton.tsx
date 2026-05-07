import { buttonClass } from "@/lib/tailwindClasses"
import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"

type Props = {
    filter: {
        id: string
        label: string
        options: string[]
    }
}

// TODO COMPLETE
const FilterButton = ({
    filter
}: Props) => {
    const { id, label, options } = filter

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className={`bg-gray-200 rounded-full ${buttonClass}`}>
                    {label}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-45 mt-2" align="end">
                <DropdownMenuGroup>
                    
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default FilterButton