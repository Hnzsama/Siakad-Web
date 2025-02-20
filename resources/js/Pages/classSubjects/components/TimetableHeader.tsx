import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DaySchedule } from '@/types/app/timetable';
import React from 'react';

interface TimetableHeaderProps {
    daySchedules: DaySchedule[];
}

export const TimetableHeader: React.FC<TimetableHeaderProps> = ({ daySchedules }) => {
    return (
        <TableHeader>
            <TableRow>
                <TableHead className="w-[100px] sticky left-0 z-20 py-2 px-4 font-medium text-center bg-background border-r">
                    Waktu
                </TableHead>
                {daySchedules.map((day, index) => {
                    const startTime = day.startTime || "07:00";
                    const endTime = day.endTime || "14:00";

                    return (
                        <TableHead
                            key={index}
                            className="w-[300px] border-r last:border-r-0"
                        >
                            <div className="flex flex-col items-center py-2">
                                <span className="font-medium">
                                    {day.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {startTime} - {endTime}
                                </span>
                            </div>
                        </TableHead>
                    );
                })}
            </TableRow>
        </TableHeader>
    );
};
