// import React from 'react';
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import { cn } from "@/lib/utils";
// import {
//     Tooltip,
//     TooltipContent,
//     TooltipProvider,
//     TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Badge } from "@/components/ui/badge";
// import { Calendar, Clock } from "lucide-react";

// const MonthlySchedule = () => {
//     const months = [
//         "Januari", "Februari", "Maret", "April", "Mei", "Juni",
//         "Juli", "Agustus", "September", "Oktober", "November", "Desember"
//     ];

//     const scheduleData = {
//         "Januari": {
//             3: [{ time: "06:26", type: "MASUK" }, { time: "10:22", type: "PULANG" }],
//             6: [{ time: "06:28", type: "MASUK" }],
//             7: [{ time: "07:34", type: "MASUK" }],
//             8: [{ time: "05:05", type: "MASUK" }, { time: "15:04", type: "PULANG" }],
//             9: [{ time: "06:24", type: "MASUK" }],
//             10: [{ time: "06:33", type: "MASUK" }],
//             13: [{ time: "06:16", type: "MASUK" }],
//             14: [{ time: "06:18", type: "MASUK" }, { time: "14:59", type: "PULANG" }],
//             15: [{ time: "14:58", type: "PULANG" }, { time: "15:06", type: "PULANG" }],
//             16: [{ time: "06:26", type: "MASUK" }, { time: "14:58", type: "PULANG" }],
//             17: [{ time: "06:02", type: "MASUK" }, { time: "12:35", type: "PULANG" }],
//             20: [{ time: "06:24", type: "MASUK" }, { time: "14:57", type: "PULANG" }],
//             21: [{ time: "06:48", type: "MASUK" }],
//             24: [{ time: "06:22", type: "MASUK" }],
//             30: [{ time: "06:15", type: "MASUK" }],
//             31: [{ time: "06:24", type: "MASUK" }]
//         },
//         "Februari": {
//             3: [{ time: "06:17", type: "MASUK" }],
//             4: [{ time: "06:21", type: "MASUK" }]
//         }
//     };

//     const renderTimeCell = (month, day) => {
//         const schedules = scheduleData[month]?.[day] || [];
//         if (schedules.length === 0) return null;

//         return (
//             <div className="flex flex-col gap-1.5">
//                 {schedules.map((schedule, idx) => (
//                     <TooltipProvider key={idx}>
//                         <Tooltip>
//                             <TooltipTrigger asChild>
//                                 <div
//                                     className={cn(
//                                         "relative group cursor-default",
//                                         "flex items-center gap-1.5 justify-center",
//                                         "px-3 py-1.5 rounded-md text-xs font-medium",
//                                         "transition-all duration-200 hover:scale-105",
//                                         "shadow-sm hover:shadow-md",
//                                         schedule.type === "MASUK"
//                                             ? "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 hover:from-blue-100 hover:to-blue-200 dark:from-blue-950 dark:to-blue-900 dark:text-blue-200"
//                                             : "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 hover:from-emerald-100 hover:to-emerald-200 dark:from-emerald-950 dark:to-emerald-900 dark:text-emerald-200"
//                                     )}
//                                 >
//                                     <Clock className="w-3 h-3" />
//                                     {schedule.time}
//                                 </div>
//                             </TooltipTrigger>
//                             <TooltipContent>
//                                 <p>{schedule.type} - {schedule.time}</p>
//                             </TooltipContent>
//                         </Tooltip>
//                     </TooltipProvider>
//                 ))}
//             </div>
//         );
//     };

//     return (
//         <Card className="w-full shadow-sm backdrop-blur-sm bg-background/95">
//             <CardHeader className="border-b border-border/40 bg-card/50">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                         <Calendar className="w-5 h-5 text-primary" />
//                         <CardTitle className="text-xl">Rekap Bulanan</CardTitle>
//                     </div>
//                     <div className="flex gap-4">
//                         <Badge variant="outline" className="flex items-center gap-2 px-3 py-1.5">
//                             <div className="w-2 h-2 bg-blue-500 rounded-full" />
//                             <span>Masuk</span>
//                         </Badge>
//                         <Badge variant="outline" className="flex items-center gap-2 px-3 py-1.5">
//                             <div className="w-2 h-2 rounded-full bg-emerald-500" />
//                             <span>Pulang</span>
//                         </Badge>
//                     </div>
//                 </div>
//             </CardHeader>
//             <CardContent className="p-6 overflow-auto">
//                 <Table className="border-collapse">
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead className={cn(
//                                 "sticky left-0 z-[41] w-32 text-center",
//                                 "border border-border/30",
//                                 "bg-background/95 backdrop-blur-sm", // Updated background
//                                 "shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]", // Add shadow for depth
//                                 "dark:border-border/20",
//                                 "after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-border/50" // Add separator
//                             )}>
//                                 Nama Bulan
//                             </TableHead>
//                             {Array.from({ length: 31 }, (_, i) => (
//                                 <TableHead
//                                     key={i + 1}
//                                     className={cn(
//                                         "w-16 text-center",
//                                         "border border-border/30",
//                                         "bg-muted/50 backdrop-blur-sm hover:bg-muted/80",
//                                         "dark:border-border/20"
//                                     )}
//                                 >
//                                     {i + 1}
//                                 </TableHead>
//                             ))}
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {months.map((month) => (
//                             <TableRow key={month} className="group/row hover:bg-muted/50">
//                                 <TableCell className={cn(
//                                     "sticky left-0 z-[41] font-medium",
//                                     "border border-border/30",
//                                     "bg-background/95 backdrop-blur-sm", // Updated background
//                                     "shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]", // Add shadow for depth
//                                     "dark:border-border/20",
//                                     "after:absolute after:right-0 after:top-0 after:h-full after:w-[1px] after:bg-border/50", // Add separator
//                                     "group-hover/row:!bg-muted/50", // Force background change on hover
//                                     "transition-colors duration-200" // Smooth transition
//                                 )}>
//                                     {month}
//                                 </TableCell>
//                                 {Array.from({ length: 31 }, (_, i) => (
//                                     <TableCell
//                                         key={i + 1}
//                                         className={cn(
//                                             "p-2 min-w-[4rem] h-[4.5rem]",
//                                             "border border-border/30",
//                                             "transition-colors duration-200",
//                                             "dark:border-border/20",
//                                             "hover:bg-muted/30"
//                                         )}
//                                     >
//                                         {renderTimeCell(month, i + 1)}
//                                     </TableCell>
//                                 ))}
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </CardContent>
//         </Card>
//     );
// };

// export default MonthlySchedule;
