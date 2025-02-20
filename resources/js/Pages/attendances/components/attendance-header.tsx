import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export const AttendanceHeader = () => {
    return (
        <CardHeader className="border-b border-border/40 bg-card/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <CardTitle className="text-xl">Rekap Bulanan</CardTitle>
                </div>
                <div className="flex gap-4">
                    <Badge variant="outline" className="flex items-center gap-2 px-3 py-1.5">
                        <div className="w-2 h-2 bg-blue-700 dark:bg-blue-200 rounded-full" />
                        <span className="text-blue-700 dark:text-blue-200">Masuk</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-2 px-3 py-1.5">
                        <div className="w-2 h-2 bg-orange-700 dark:bg-orange-200 rounded-full" />
                        <span className="text-orange-700 dark:text-orange-200">Pulang</span>
                    </Badge>
                </div>
            </div>
        </CardHeader>
    );
};
