import React from "react";
import RootLayout from '@/Layouts/RootLayout'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { DragDropContext } from "react-beautiful-dnd";
import { Card } from "@/components/ui/card";
import { Head } from '@inertiajs/react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { SubjectList } from "./components/subjectList";
import { TimetableCell } from "./components/TimetableCell";
import { TimetableHeader } from "./components/TimetableHeader";
import { useTimetableState } from "@/hooks/useTimetableState";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Search } from "@/components/search";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { SubjectListSidebarProvider, useSubjectListSidebar } from "@/context/subject-list-sidebar-context";
import { SubjectListSidebarTrigger } from "@/components/subject-list-sidebar-trigger"
import { ClassroomSelector } from "./components/ClassroomSelector";
import { BreakDurationDialog } from './components/BreakDurationDialog';
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { hasRole } from "@/utils/permissions";

function ShowContent() {
    const { isOpen } = useSubjectListSidebar();
    const {
        schedule,
        error,
        daySchedules,
        activeSubjectTeachers,
        subjectList,
        timeSlotsPerDay,
        allTimeSlots,
        breakSchedules,
        classroom,
        classrooms,
        isBreakTime,
        calculateMaxHeight,
        handleDragEnd,
        handleResizeStart,
        handleResize,
        handleResizeStop,
        handleRemoveSchedule,
        isBreakDialogOpen,
        setIsBreakDialogOpen,
        handleBreakDurationConfirm,
        handleSaveSchedule,
        processing,
    } = useTimetableState();

    return (
        <>
            <Head title="Buat Jadwal Pelajaran" />
            <Header fixed>
                <div className="flex items-center gap-4">
                    <Search />
                </div>
                <div className='flex items-center ml-auto space-x-4'>
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>
            <div className="peer-[.header-fixed]/header:mt-16 h-[calc(100vh-64px)] border-t overflow-hidden">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="relative flex h-full">
                        {/* Subject List Sidebar - Responsive */}
                        <div
                            className={`h-full bg-background border-r z-30 transition-all duration-300 overflow-hidden ${isOpen ? 'w-[300px]' : 'w-0'
                                }`}
                        >
                            <div className="w-[300px] h-full overflow-y-auto [&_[data-rbd-draggable-context-id]]:z-50">
                                <SubjectList
                                    subjects={subjectList}
                                    activeSubjectTeachers={activeSubjectTeachers}
                                />
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className={`z-20 flex flex-col flex-1 min-w-0 bg-background ${isOpen ? '' : ''
                            }`}>
                            {/* Navigation Header - Fixed */}
                            <header className={`flex items-center gap-2 p-4 border-b bg-background ${hasRole('student') ? 'hidden' : ''}`}>
                                <ClassroomSelector
                                    classrooms={classrooms}
                                    currentClassroomId={classroom?.id}
                                />
                            </header>

                            {/* Timetable Container - Scrollable */}
                            <div className="flex-1 overflow-auto"> {/* Single scroll container */}
                                <Table className="border-collapse table-fixed" style={{
                                    width: `${(daySchedules.length * 300)}px`,
                                }}>
                                    <TimetableHeader daySchedules={daySchedules} />
                                    <TableBody>
                                        {allTimeSlots.slice(0, -1).map((time, timeIndex) => (
                                            <TableRow key={timeIndex} className="relative">
                                                <TableCell
                                                    className="sticky left-0 w-[100px] flex-none font-medium bg-background border-r p-3 whitespace-nowrap z-[41]"
                                                >
                                                    <div className="flex flex-col items-center justify-between gap-2">
                                                        <div className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md">
                                                            {time}
                                                        </div>
                                                        <div className="px-2.5 py-1 text-xs font-medium bg-primary/20 text-primary/70 rounded-md">
                                                            {allTimeSlots[timeIndex + 1]}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <td className="p-0">
                                                    <div className="flex">
                                                        {daySchedules.map((_, dayIndex) => {
                                                            const daySlots = timeSlotsPerDay[dayIndex].slots;
                                                            const cellKey = `schedule-${time}-${dayIndex}`;
                                                            const cell = schedule[cellKey];
                                                            const isValidTimeSlot = daySlots.includes(time);

                                                            return (
                                                                <div key={cellKey} className="w-[300px] flex-none">
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
                                                                        nextTimeSlot={allTimeSlots[timeIndex + 1]}
                                                                        onRemove={handleRemoveSchedule}
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
                    </div>
                </DragDropContext>
            </div>
            <BreakDurationDialog
                isOpen={isBreakDialogOpen}
                onClose={() => setIsBreakDialogOpen(false)}
                onConfirm={handleBreakDurationConfirm}
            />
        </>
    );
}

function Show() {
    return (
        <SubjectListSidebarProvider defaultOpen={false}>
            <ShowContent />
        </SubjectListSidebarProvider>
    );
}

// Definisikan nested layout
Show.layout = (page: React.ReactNode) => (
    <RootLayout>
        <AuthenticatedLayout>{page}</AuthenticatedLayout>
    </RootLayout>
)

export default Show;
