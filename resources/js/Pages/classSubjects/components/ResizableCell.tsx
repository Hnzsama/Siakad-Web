import React from 'react';
import { ScheduleItem } from '@/types/app/timetable';
import { cn } from '@/lib/utils';
import { BookOpen, GraduationCap, Clock, X, Coffee } from 'lucide-react';

interface ResizableCellProps {
    cell: ScheduleItem;
    cellKey: string;
    dayIndex: number;
    onResize: (cellKey: string, e: any, data: any) => void;
    onResizeStart: () => void;
    onResizeStop: (cellKey: string, e: any, data: any) => void;
    calculateMaxHeight: (startTime: string, dayIndex: number) => number;
    onRemove: (cellKey: string) => void;
}

export const ResizableCell: React.FC<ResizableCellProps> = ({
    cell,
    cellKey,
    dayIndex,
    onResize,
    onResizeStart,
    onResizeStop,
    calculateMaxHeight,
    onRemove,
}) => {
    const isClassSubjectsShow = route().current() === 'classSubjects.show';

    return (
        <div className="relative w-full h-full group">
            <div
                className={cn(
                    "rounded-md transition-colors duration-200 flex flex-col p-3 gap-1.5 absolute inset-0",
                    "border",
                    cell.type === 'break'
                        ? "bg-orange-50/90 dark:bg-orange-900/20 hover:bg-orange-100/90 dark:hover:bg-orange-900/30 border-orange-200/50 dark:border-orange-800/50 text-orange-800 dark:text-orange-200"
                        : "bg-primary/5 hover:bg-primary/10 border-primary/10",
                    "z-40"
                )}
                style={{
                    height: `${Math.floor(cell.height)}px`,
                    transform: 'translate3d(0,0,0)',
                }}
            >
                {/* Remove button */}
                <button
                    hidden={isClassSubjectsShow}
                    onClick={() => onRemove(cellKey)}
                    className={cn(
                        "absolute -top-2 -right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100",
                        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                        "shadow-sm transition-all duration-200 z-50"
                    )}
                >
                    <X className="w-3 h-3" />
                </button>

                {/* Content based on type */}
                {cell.type === 'break' ? (
                    <>
                        <div className="flex items-center gap-2">
                            <Coffee className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            <span className="font-medium">{cell.name}</span>
                        </div>
                        <div className="text-xs text-orange-700/90 dark:text-orange-300/90">
                            {cell.startTime} - {cell.endTime}
                        </div>
                        <div className="text-xs text-orange-600/75 dark:text-orange-400/75">
                            {cell.duration} menit
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-primary" />
                                <span className="font-medium truncate text-primary">
                                    {cell.subject?.split(' - ')[0]}
                                </span>
                            </div>
                            <span className="truncate px-2 py-0.5 text-[10px] font-medium bg-primary/20 text-primary rounded-full">
                                {cell.subjectDetail?.code || 'Tanpa Kode'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-foreground/70">
                            <GraduationCap className="w-3.5 h-3.5 text-primary/70" />
                            <span>{cell.subject?.split(' - ')[1]}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-foreground/60">
                            <Clock className="w-3.5 h-3.5 text-primary/60" />
                            <span>{cell.startTime} - {cell.endTime}</span>
                            <span className="ml-1">• {cell.subjectDetail?.type ? (cell.subjectDetail?.type === "theorical" ? "Teori" : "Praktik") : 'Tanpa Tipe'}</span>
                        </div>
                    </>
                )}

                {/* Resize handle - only render if not on classSubjects.show route */}
                {!isClassSubjectsShow && (
                    <div
                        className={cn(
                            "absolute bottom-0 left-0 right-0 h-2 cursor-s-resize",
                            cell.type === 'break'
                                ? "hover:bg-orange-200/50 dark:hover:bg-orange-700/50"
                                : "hover:bg-primary/20",
                            "z-10"
                        )}
                        style={{ transform: 'translate3d(0,0,0)' }}
                        onMouseDown={(e) => {
                            onResizeStart();
                            const startY = e.clientY;
                            const startHeight = cell.height;

                            const handleMouseMove = (moveEvent: MouseEvent) => {
                                const delta = moveEvent.clientY - startY;
                                const rawHeight = startHeight + delta;
                                const snappedHeight = Math.round(rawHeight / 100) * 100;
                                const newHeight = Math.max(100, Math.min(
                                    snappedHeight,
                                    calculateMaxHeight(cell.startTime, dayIndex)
                                ));

                                onResize(cellKey, moveEvent, {
                                    size: { width: 300, height: newHeight }
                                });
                            };

                            const handleMouseUp = (upEvent: MouseEvent) => {
                                document.removeEventListener('mousemove', handleMouseMove);
                                document.removeEventListener('mouseup', handleMouseUp);
                                const delta = upEvent.clientY - startY;
                                const newHeight = Math.max(100, Math.min(
                                    startHeight + delta,
                                    calculateMaxHeight(cell.startTime, dayIndex)
                                ));
                                onResizeStop(cellKey, upEvent, {
                                    size: { width: 300, height: newHeight }
                                });
                            };

                            document.addEventListener('mousemove', handleMouseMove);
                            document.addEventListener('mouseup', handleMouseUp);
                        }}
                    >
                        <div className={cn(
                            "absolute inset-x-0 bottom-0 h-[2px]",
                            cell.type === 'break'
                                ? "bg-orange-200/50 dark:bg-orange-700/50"
                                : "bg-primary/20"
                        )} />
                    </div>
                )}
            </div>
        </div>
    );
};
