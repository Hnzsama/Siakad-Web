import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TimetableCell } from "./TimetableCell";
import { TimetableHeader } from "./TimetableHeader";
import { DaySchedule, ScheduleItem, TimeSlot, BreakSchedule } from '@/types/app/timetable';

interface TimetableContentProps {
    daySchedules: DaySchedule[]
    allTimeSlots: string[]
    timeSlotsPerDay: TimeSlot[]
    schedule: { [key: string]: ScheduleItem }
    isBreakTime: (time: string) => boolean
    breakSchedules: BreakSchedule[]
    handleResize: (cellKey: string, e: any, data: any) => void
    handleResizeStart: () => void
    handleResizeStop: (cellKey: string, e: any, data: any) => void
    calculateMaxHeight: (startTime: string, dayIndex: number) => number
    handleRemoveSchedule: (cellKey: string) => void; // Add this prop
}

const TimetableContent: React.FC<TimetableContentProps> = ({
    daySchedules,
    allTimeSlots,
    timeSlotsPerDay,
    schedule,
    isBreakTime,
    breakSchedules,
    handleResize,
    handleResizeStart,
    handleResizeStop,
    calculateMaxHeight,
    handleRemoveSchedule,
}) => {
    // Calculate dynamic column width based on available space and number of days
    const getDayColumnWidth = () => {
        const minWidth = 200; // Minimum width for day columns
        const maxWidth = 300; // Maximum width for day columns
        const availableWidth = `min(${maxWidth}px, max(${minWidth}px, (100% - 100px) / ${daySchedules.length}))`;
        return availableWidth;
    };

    const dayColumnWidth = getDayColumnWidth();

    return (
        <div className="flex-1 overflow-hidden">
            <div className="relative overflow-auto">
                <Table className="w-full border-collapse">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="p-0">
                                <div className="grid" style={{
                                    gridTemplateColumns: `repeat(${daySchedules.length}, ${dayColumnWidth})`,
                                }}>
                                    {daySchedules.map((day, index) => (
                                        <div key={index} className="p-4 text-sm font-medium text-center border-r last:border-r-0">
                                            {day.name}
                                        </div>
                                    ))}
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allTimeSlots.map((time, timeIndex) => (
                            <TableRow key={timeIndex} className="relative">
                                <TableCell className="sticky left-0 z-20 w-[100px] min-w-[100px] font-medium text-center bg-white border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                    {time}
                                </TableCell>
                                <td className="p-0">
                                    <div className="grid" style={{
                                        gridTemplateColumns: `repeat(${daySchedules.length}, ${dayColumnWidth})`,
                                    }}>
                                        {daySchedules.map((_, dayIndex) => {
                                            const daySlots = timeSlotsPerDay[dayIndex].slots;
                                            const cellKey = `schedule-${time}-${dayIndex}`;
                                            const cell = schedule[cellKey];
                                            const isValidTimeSlot = daySlots.includes(time);

                                            return (
                                                <div key={cellKey} className="overflow-hidden">
                                                    <TimetableCell
                                                        cellKey={cellKey}
                                                        time={time}
                                                        dayIndex={dayIndex}
                                                        isValidTimeSlot={isValidTimeSlot}
                                                        isBreakTime={isBreakTime(time)}
                                                        breakSchedules={breakSchedules}
                                                        cell={cell}
                                                        onResize={handleResize}
                                                        onResizeStart={handleResizeStart}
                                                        onResizeStop={handleResizeStop}
                                                        calculateMaxHeight={calculateMaxHeight}
                                                        onRemove={handleRemoveSchedule} // Add this prop
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </td>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default TimetableContent;
