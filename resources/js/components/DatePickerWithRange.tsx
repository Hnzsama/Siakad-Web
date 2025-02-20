import * as React from "react"
import { addDays, format, isWithinInterval } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { Table } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
    table: Table<any>
}

export function DatePickerWithRange({
    className,
    table,
}: DatePickerWithRangeProps) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: undefined,
        to: undefined
    })

    // Effect untuk mengupdate filter table ketika date berubah
    React.useEffect(() => {
        if (date?.from || date?.to) {
            table.getColumn('created_at')?.setFilterValue(date)
        } else {
            table.getColumn('created_at')?.setFilterValue(undefined)
        }
    }, [date, table])

    return (
        <div className={cn("grid gap-2", className)}>
            <TooltipProvider>
                <Tooltip>
                    <Popover>
                        <PopoverTrigger asChild>
                            <TooltipTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-8 h-8 font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className={cn(
                                        date?.from && "text-primary"
                                    )} />
                                </Button>
                            </TooltipTrigger>
                        </PopoverTrigger>
                        <TooltipContent>
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "LLL dd, y")} -{" "}
                                        {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </TooltipContent>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}
