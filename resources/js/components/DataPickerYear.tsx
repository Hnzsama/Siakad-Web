import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CalendarSelectYear } from "./CalendarSelectYear"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerYearProps {
    id: string
    label: string
    value: string | undefined
    onChange: (date: string) => void
    error?: string
}

const DatePickerYear = ({
    id,
    label,
    value,
    onChange,
    error
}: DatePickerYearProps) => {
    // Konversi string date ke Date object
    const date = value ? new Date(value) : undefined

    // Handler untuk perubahan tanggal
    const handleDateChange = (newDate: Date | undefined) => {
        // Konversi Date object ke format YYYY-MM-DD untuk Laravel
        onChange(newDate ? format(newDate, 'yyyy-MM-dd') : '')
    }

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        variant="outline"
                        className={cn(
                            "w-full pl-3 text-left font-normal",
                            !date && "text-muted-foreground",
                            error && "ring-2 ring-destructive"
                        )}
                    >
                        {date ? (
                            format(date, "d MMMM yyyy")
                        ) : (
                            <span>Pilih tanggal</span>
                        )}
                        <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <CalendarSelectYear
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange}
                        disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            {error && <span className="text-sm text-destructive">{error}</span>}
        </div>
    )
}

export default DatePickerYear
