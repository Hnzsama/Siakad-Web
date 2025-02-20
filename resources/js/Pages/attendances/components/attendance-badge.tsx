import React from 'react';
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface AttendanceBadgeProps {
    time: string;
    type: "MASUK" | "PULANG";
}

export const AttendanceBadge = ({ time, type }: AttendanceBadgeProps) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className={cn(
                            "relative group cursor-default",
                            "flex items-center gap-1.5 justify-center",
                            "px-3 py-1.5 rounded-sm text-xs font-medium",
                            "shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]",
                            "hover:shadow-[0_2px_4px_0_rgba(0,0,0,0.05)]",
                            "transition-all duration-200 hover:scale-[1.02]",
                            type === "MASUK"
                                ? "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/50 dark:bg-blue-950 dark:hover:bg-blue-900 dark:text-blue-200 dark:border-blue-800/50"
                                : "bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200/50 dark:bg-orange-950 dark:hover:bg-orange-900 dark:text-orange-200 dark:border-orange-800/50"
                        )}
                    >
                        <Clock className="w-3 h-3" />
                        {time}
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{type} - {time}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
