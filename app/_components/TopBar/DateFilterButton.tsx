import { useState } from "react"
import { DateRange } from "react-day-picker"
import { Calendar } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { buttonClass } from "@/lib/tailwindClasses"

type Props = {
    dateRange: DateRange | undefined
    onDateRangeChange: (range: DateRange | undefined) => void
}

const DateFilterButton = ({ 
    dateRange, 
    onDateRangeChange 
}: Props) => {
    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={dateRange?.from ? "default" : "secondary"}
                    className={`flex gap-1.5 items-center ${buttonClass}`}
                >
                    Date
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 mt-2" align="start">
                <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={onDateRangeChange}
                    numberOfMonths={1}
                    disabled={{ after: new Date() }}
                />
                {
                    dateRange?.from && (
                        <div className="border-t p-2 flex justify-end">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    onDateRangeChange(undefined)
                                    setOpen(false)
                                }}
                            >
                                Clear
                            </Button>
                        </div>
                    )
                }
            </PopoverContent>
        </Popover>
    )
}

export default DateFilterButton
