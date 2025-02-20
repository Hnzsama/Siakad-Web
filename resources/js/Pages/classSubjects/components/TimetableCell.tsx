import { TableCell } from '@/components/ui/table';
import { BreakSchedule, ScheduleItem } from '@/types/app/timetable';
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { ResizableCell } from './ResizableCell';

interface TimetableCellProps {
    cellKey: string;
    time: string;
    dayIndex: number;
    isValidTimeSlot: boolean;
    isBreakTime: boolean;
    breakSchedules: BreakSchedule[];
    cell: ScheduleItem | undefined;
    onResize: (cellKey: string, e: any, data: any) => void;
    onResizeStart: () => void;
    onResizeStop: (cellKey: string, e: any, data: any) => void;
    calculateMaxHeight: (startTime: string, dayIndex: number) => number;
    nextTimeSlot?: string; // Add this new prop
    onRemove: (cellKey: string) => void; // Add this new prop
}

export const TimetableCell: React.FC<TimetableCellProps> = ({
    cellKey,
    time,
    dayIndex,
    isValidTimeSlot,
    isBreakTime,
    breakSchedules,
    cell,
    onResize,
    onResizeStart,
    onResizeStop,
    calculateMaxHeight,
    nextTimeSlot,
    onRemove,
}) => {
    const droppableProps = React.useMemo(() => ({
        droppableId: cellKey,
        type: "DEFAULT",
        mode: "standard" as const,
        direction: "vertical" as const,
        renderClone: undefined,
        ignoreContainerClipping: false,
        isCombineEnabled: false,
        isDropDisabled: !isValidTimeSlot
    }), [cellKey, isValidTimeSlot]); // Hapus isBreakTime dari dependencies

    const breakSchedule = breakSchedules.find(
        (bs) => time >= bs.startTime && time < bs.endTime
    );

    return (
        <Droppable {...droppableProps}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                        "h-[100px] relative",
                        "transition-colors duration-200 border-r last:border-r-0",
                        // Base background for invalid slots
                        !isValidTimeSlot && "bg-secondary/50 dark:bg-secondary/50",
                        // Break time styles
                        isBreakTime && isValidTimeSlot && "bg-yellow-50/90 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800",
                        // Dragging over styles
                        snapshot.isDraggingOver && "bg-accent hover:bg-accent dark:bg-accent/20 dark:hover:bg-accent/30",
                        // Valid slot hover styles - make sure this is consistent across all cells
                        isValidTimeSlot && !isBreakTime && !cell && "hover:bg-accent/10 dark:hover:bg-accent/10",
                        // Group hover for time display
                        "group"
                    )}
                >
                    {/* Optional time range display */}
                    {isValidTimeSlot && !isBreakTime && !cell && (
                        <div className="absolute inset-0 flex items-center justify-center text-xs opacity-0 text-muted-foreground group-hover:opacity-100">
                            {time} - {nextTimeSlot}
                        </div>
                    )}

                    {/* Break Time Display */}
                    {isValidTimeSlot && isBreakTime && (
                        <div className={cn(
                            "absolute inset-0 flex flex-col items-center justify-center gap-1 p-2",
                            "text-orange-800 dark:text-orange-200",
                            "bg-orange-100/70 dark:bg-orange-900/40",
                            "border border-orange-200/50 dark:border-orange-800/50",
                            "backdrop-blur-[2px]"
                        )}>
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-medium text-center">
                                {breakSchedule?.name || 'Break Time'}
                            </span>
                        </div>
                    )}

                    {/* Schedule Item Display */}
                    {isValidTimeSlot && !isBreakTime && cell && cell.isResizable && (
                        <ResizableCell
                            cell={cell}
                            cellKey={cellKey}
                            dayIndex={dayIndex}
                            onResize={onResize}
                            onResizeStart={onResizeStart}
                            onResizeStop={onResizeStop}
                            calculateMaxHeight={calculateMaxHeight}
                            onRemove={onRemove}
                        />
                    )}

                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};
