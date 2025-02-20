import React from 'react';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerFutureProps {
    id: string
    label: string
    value: string | undefined
    onChange: (date: string) => void
    error?: string
}

const DatePickerFuture = ({
    id,
    label,
    value,
    onChange,
    error
}: DatePickerFutureProps) => {
    // Convert string date to Date object
    const date = value ? new Date(value) : undefined

    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Handler for date changes
    const handleDateChange = (newDate: Date | undefined) => {
        // Convert Date object to YYYY-MM-DD format for Laravel
        onChange(newDate ? format(newDate, 'yyyy-MM-dd') : '');
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
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                            error && "border-red-500"
                        )}
                    >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {date ? (
                            format(date, "d MMMM yyyy")
                        ) : (
                            <span>Pilih tanggal</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange}
                        fromDate={today}
                        disabled={(date) => {
                            const currentDate = new Date(date);
                            return currentDate < today;
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
    );
}

export default DatePickerFuture;