import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const MonthlyTableHeader = () => {
    return (
        <TableHeader className="border-t-2"> {/* Added thicker top border */}
            <TableRow>
                <TableHead className={cn(
                    "sticky left-0 z-20",
                    "w-[100px] min-w-[100px]",
                    "font-medium text-center",
                    "bg-background",
                    "border-r",
                )}>
                    Bulan
                </TableHead>
                {Array.from({ length: 31 }, (_, i) => (
                    <TableHead
                        key={i + 1}
                        className={cn(
                            "w-[60px] min-w-[60px]",
                            "text-center font-medium",
                            "border-r last:border-r-0",
                        )}
                    >
                        {i + 1}
                    </TableHead>
                ))}
            </TableRow>
        </TableHeader>
    );
};
