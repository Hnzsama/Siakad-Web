import { cn } from '@/lib/utils';
import { Coffee } from 'lucide-react';
import { Draggable } from 'react-beautiful-dnd';

export const BreakCard = () => {
    return (
        <Draggable draggableId="break-card" index={0}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cn(
                        "flex flex-col gap-1.5 p-3 py-6",
                        "transition-all duration-200 ease-in-out",
                        "border-b last:border-b-0",
                        "cursor-move select-none",
                        "bg-orange-50/50 dark:bg-orange-900/20",
                        "hover:bg-orange-100/80 dark:hover:bg-orange-900/30",
                        "border-orange-200/50 dark:border-orange-800/50",
                        snapshot.isDragging ? 'shadow-lg scale-[1.02]' : ''
                    )}
                >
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            <Coffee className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            <span className="font-medium text-orange-800 dark:text-orange-200">
                                Waktu Istirahat
                            </span>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] text-nowrap font-medium bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300 rounded-full">
                            Break
                        </span>
                    </div>
                    <div className="text-xs text-orange-600/80 dark:text-orange-300/80">
                        Drag untuk menambahkan waktu istirahat
                    </div>
                </div>
            )}
        </Draggable>
    );
};
