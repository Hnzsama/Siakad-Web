import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, DayPickerSingleProps } from "react-day-picker"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type CalendarProps = Omit<DayPickerSingleProps, "mode"> & {
    mode?: "single"
}

function CalendarSelectYear({
    className,
    classNames,
    showOutsideDays = true,
    selected,
    onSelect,
    disabled,
    ...props
}: CalendarProps) {
    // Get current year and set boundaries
    const today = new Date()
    const currentYear = today.getFullYear()
    const minYear = 1900
    
    // Create array of years (from 1900 to current year)
    const years = Array.from(
        { length: currentYear - minYear + 1 }, 
        (_, i) => minYear + i
    ).reverse() // Reverse array so latest years appear first

    // Array of months in Indonesian
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ]

    // State untuk menyimpan bulan yang ditampilkan
    const [month, setMonth] = React.useState<Date>(
        selected || new Date(currentYear, today.getMonth())
    )

    // Custom caption component
    const CustomCaption = ({ displayMonth }: { displayMonth: Date }) => {
        const currentMonth = displayMonth.getMonth()
        const year = displayMonth.getFullYear()

        const handleYearSelect = (selectedYear: string) => {
            const newDate = new Date(displayMonth)
            newDate.setFullYear(parseInt(selectedYear))
            setMonth(newDate)
        }

        const handleMonthSelect = (selectedMonth: string) => {
            const monthIndex = months.indexOf(selectedMonth)
            const newDate = new Date(displayMonth)
            newDate.setMonth(monthIndex)
            setMonth(newDate)
        }

        return (
            <div className="flex items-center justify-center gap-2">
                <Select
                    value={months[currentMonth]}
                    onValueChange={handleMonthSelect}
                >
                    <SelectTrigger className="h-8 w-[120px]">
                        <SelectValue>{months[currentMonth]}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {months.map((month) => (
                            <SelectItem key={month} value={month}>
                                {month}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={year.toString()}
                    onValueChange={handleYearSelect}
                >
                    <SelectTrigger className="h-8 w-[90px]">
                        <SelectValue>{year}</SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                        {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        )
    }

    return (
        <DayPicker
            mode="single"
            locale={id}
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            month={month}
            onMonthChange={setMonth}
            selected={selected}
            onSelect={onSelect}
            disabled={disabled}
            fromYear={minYear}
            toYear={currentYear}
            captionLayout="dropdown"
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "hidden",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                    "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:rounded-md",
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
                ),
                day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside:
                    "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
                day_disabled: "text-muted-foreground opacity-50",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                IconLeft: ({ className, ...props }) => (
                    <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
                ),
                IconRight: ({ className, ...props }) => (
                    <ChevronRight className={cn("h-4 w-4", className)} {...props} />
                ),
                Caption: CustomCaption
            }}
            {...props}
        />
    )
}
CalendarSelectYear.displayName = "CalendarSelectYear"

export { CalendarSelectYear }