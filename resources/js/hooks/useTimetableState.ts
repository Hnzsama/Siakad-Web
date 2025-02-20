// hooks/useTimetableState.ts
import { useState, useMemo } from 'react';
import { useForm, usePage } from "@inertiajs/react";
import { CreateResponse } from '@/Pages/classSubjects/data/schema';
import { formatTime, calculateTimeSlots  } from '@/utils/timeUtils';
import { ClassSubjectRequest } from '@/types/app/timetable';
import {
    ScheduleItem,
    DaySchedule,
    TimeSlot,
    SubjectTeacher,
    BreakSchedule
} from '@/types/app/timetable';
import { useToast } from './use-toast';
import { useResourceContext } from '@/Pages/classSubjects/context/context';

export const useTimetableState = () => {
    const { classroom, subjectTeachers, classrooms, classSubjects } = usePage<CreateResponse>().props;
    const schedules = classroom?.shift?.schedules;
    const durationPerSlot = classroom?.shift?.class_duration ?? 45;
    const CELL_HEIGHT = 100; // Move constants to the top
    const { toast } = useToast();
    const { post, processing } = useForm();

    const handleSaveSchedule = () => {
        const scheduleRequests = prepareScheduleRequest(schedule, classroom?.id || null);

        // Add debug logging
        console.log('Current Schedule State:', schedule);
        console.log('Schedule Requests to be sent:', scheduleRequests);

        post(route('classSubjects.bulkUpdate', {
            classroom_id: classroom?.id,
            schedules: scheduleRequests
        }), {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Schedule saved successfully');
                toast({
                    title: "Jadwal berhasil disimpan",
                    description: `${Object.keys(schedule).length} jadwal telah diperbarui dalam sistem`,
                });
            },
            onError: (errors: any) => {
                console.error('Save Error:', errors);
                toast({
                    variant: "destructive",
                    title: "Gagal menyimpan jadwal",
                    description: errors.error || "Terjadi kesalahan saat menyimpan jadwal",
                });
            },
        });
    };

    // Move utility functions before they're used
    const calculateDuration = (startTime: string, endTime: string, dayIndex: number) => {
        const daySlots = timeSlotsPerDay[dayIndex].slots;
        const startIndex = daySlots.indexOf(startTime);
        const endIndex = daySlots.indexOf(endTime);
        return endIndex - startIndex;
    };

    const calculateEndTime = (startTime: string, slots: number, dayIndex: number) => {
        const daySlots = timeSlotsPerDay[dayIndex].slots;
        const startIndex = daySlots.indexOf(startTime);
        const endIndex = startIndex + slots;

        // Get the actual end time from slots
        const endTime = daySlots[endIndex];
        if (!endTime) return daySlots[daySlots.length - 1];
        return endTime;
    };

    const isWithinDayBounds = (startTime: string, endTime: string, dayIndex: number) => {
        const daySlots = timeSlotsPerDay[dayIndex].slots;
        const lastValidSlot = daySlots[daySlots.length - 1];
        return daySlots.indexOf(endTime) <= daySlots.indexOf(lastValidSlot);
    };

    const hasScheduleConflict = (cellKey: string, startTime: string, endTime: string) => {
        const [_, time, currentDay] = cellKey.split("-");
        const dayIndex = parseInt(currentDay);
        const daySlots = timeSlotsPerDay[dayIndex].slots;

        for (const key in schedule) {
            if (key === cellKey) continue;
            const [__, scheduleTime, scheduleDay] = key.split("-");
            if (scheduleDay !== currentDay) continue;

            const existingSchedule = schedule[key];
            const existingStartIndex = daySlots.indexOf(existingSchedule.startTime);
            const existingEndIndex = daySlots.indexOf(existingSchedule.endTime);
            const newStartIndex = daySlots.indexOf(startTime);
            const newEndIndex = daySlots.indexOf(endTime);

            if ((newStartIndex >= existingStartIndex && newStartIndex < existingEndIndex) ||
                (newEndIndex > existingStartIndex && newEndIndex <= existingEndIndex) ||
                (newStartIndex <= existingStartIndex && newEndIndex >= existingEndIndex)) {
                return true;
            }
        }
        return false;
    };

    const calculateMaxHeight = (startTime: string, dayIndex: number) => {
        const daySlots = timeSlotsPerDay[dayIndex].slots;
        const startIndex = daySlots.indexOf(startTime);
        const remainingSlots = daySlots.length - startIndex;
        return remainingSlots * 100; // Base height is now 100px
    };

    const calculateSlots = (height: number) => {
        return Math.round(height / CELL_HEIGHT);
    };

    // Hapus breakSchedules default
    const breakSchedules: BreakSchedule[] = [];

    // Process day schedules and time slots first
    const daySchedules = useMemo<DaySchedule[]>(() => {
        if (!schedules) {
            return [];  // Remove console.log
        }

        const dayNames: { [key: string]: string } = {
            "Monday": "Senin",
            "Tuesday": "Selasa",
            "Wednesday": "Rabu",
            "Thursday": "Kamis",
            "Friday": "Jumat",
            "Saturday": "Sabtu",
            "Sunday": "Minggu"
        };

        return schedules
            .filter(schedule => schedule.status !== 0)
            .map((schedule, index) => ({
                day: index + 1,
                startTime: formatTime(schedule.start_time),
                endTime: formatTime(schedule.end_time),
                name: dayNames[schedule.day] || schedule.day,
                originalDay: schedule.day
            }))
            .sort((a, b) => {
                const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                return dayOrder.indexOf(a.originalDay) - dayOrder.indexOf(b.originalDay);
            });
    }, [schedules]);

    const timeSlotsPerDay = useMemo<TimeSlot[]>(() => {
        return daySchedules.map(day => ({
            day: day.day,
            slots: calculateTimeSlots(day.startTime, day.endTime, durationPerSlot)
        }));
    }, [daySchedules]);

    // Process subject teachers
    const activeSubjectTeachers = useMemo<SubjectTeacher[]>(() => {
        if (!subjectTeachers) return [];
        return subjectTeachers.map(st => ({
            id: st.id,
            created_at: st.created_at,
            updated_at: st.updated_at,
            teacher_id: st.teacher_id,
            subject_id: st.subject_id,
            subject: {
                id: st.subject.id,
                name: st.subject.name,
                created_at: st.subject.created_at,
                updated_at: st.subject.updated_at,
                code: st.subject.code || `SUB-${st.subject.id.slice(0, 4)}`, // Fallback code if none exists
                type: st.subject.type || 'theorical',
                description: st.subject.description,
                status: st.subject.status || 'active',
                selectedIds: st.subject.selectedIds || []
            },
            teacher: {
                id: st.teacher.id,
                name: st.teacher.name
            }
        }));
    }, [subjectTeachers]);

    // Update subjectList with better formatting
    const [subjectList, setSubjectList] = useState<string[]>(
        activeSubjectTeachers.map(st => {
            const code = st.subject.code ? `[${st.subject.code}]` : '';
            const type = st.subject.type === 'practical' ? '(P)' : '(T)';
            return `${st.subject.name} ${code} ${type}`;
        })
    );

    // Now initialize schedule with existing classSubjects
    const initialSchedule = useMemo(() => {
        if (!classSubjects) return {};

        console.log('Creating initial schedule from classSubjects:', classSubjects);
        console.log('Available daySchedules:', daySchedules);

        return classSubjects.reduce((acc, classSubject) => {
            // Find day index based on originalDay property
            const dayIndex = daySchedules.findIndex(d => {
                console.log('Comparing:', {
                    scheduleDay: d.originalDay,
                    classSubjectDay: classSubject.day,
                    match: d.originalDay === classSubject.day
                });
                return d.originalDay === classSubject.day;
            });

            console.log('Found dayIndex:', dayIndex, 'for day:', classSubject.day);

            if (dayIndex === -1) {
                console.warn('Day not found in schedules:', classSubject.day);
                return acc;
            }

            // Calculate slots based on start and end time
            const slots = calculateDuration(
                formatTime(classSubject.start_time),
                formatTime(classSubject.end_time),
                dayIndex
            );

            // Create schedule key
            const scheduleKey = `schedule-${formatTime(classSubject.start_time)}-${dayIndex}`;

            // Handle break type
            if (classSubject.type === 'break') {
                acc[scheduleKey] = {
                    type: 'break',
                    name: classSubject.name || 'Break Time',
                    startTime: formatTime(classSubject.start_time),
                    endTime: formatTime(classSubject.end_time),
                    slots,
                    height: slots * CELL_HEIGHT,
                    width: 300,
                    isResizable: true,
                    duration: durationPerSlot
                };
                return acc;
            }

            // Handle subject type
            const subjectTeacher = activeSubjectTeachers.find(
                st => st.id === classSubject.subject_teacher?.id  // Use subject_teacher.id instead of subject_teacher_id
            );

            if (subjectTeacher) {
                acc[scheduleKey] = {
                    type: 'subject',
                    subject: `${subjectTeacher.subject.name} - ${subjectTeacher.teacher.name}`,
                    subjectDetail: {
                        code: subjectTeacher.subject.code ?? "",
                        type: subjectTeacher.subject.type,
                        teacherName: subjectTeacher.teacher.name,
                        teacherId: subjectTeacher.id  // Use subject_teacher ID
                    },
                    startTime: formatTime(classSubject.start_time),
                    endTime: formatTime(classSubject.end_time),
                    slots,
                    height: slots * CELL_HEIGHT,
                    width: 300,
                    isResizable: true,
                };
            }

            return acc;
        }, {} as Record<string, ScheduleItem>);
    }, [classSubjects, activeSubjectTeachers, daySchedules, timeSlotsPerDay]); // Add timeSlotsPerDay dependency

    // Update schedule state to use initialSchedule
    const [schedule, setSchedule] = useState<{ [key: string]: ScheduleItem }>(initialSchedule);

    // State
    const [resizing, setResizing] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    // Time slots calculation
    const allTimeSlots = useMemo(() => {
        const slots = Array.from(new Set(
            timeSlotsPerDay.flatMap(day => day.slots)
        )).sort();

        // Filter untuk memastikan kita memiliki slot berikutnya
        return slots.filter((_, index) => index < slots.length);
    }, [timeSlotsPerDay]);

    // Utility functions
    const isBreakTime = (time: string) => {
        return breakSchedules.some(
            (breakSchedule) => time >= breakSchedule.startTime && time < breakSchedule.endTime
        );
    };

    // Event handlers with improved error handling
    const [isBreakDialogOpen, setIsBreakDialogOpen] = useState(false);
    const [pendingBreakData, setPendingBreakData] = useState<{
        destination: any;
        time: string;
        dayIndex: number;
    } | null>(null);

    const handleDragEnd = (result: any) => {
        const { source, destination } = result;
        if (!destination) return;

        // Handle break time drop - simplified
        if (result.draggableId === "break-card" && destination.droppableId.startsWith("schedule")) {
            const [_, time, dayIndex] = destination.droppableId.split("-");
            const parsedDayIndex = parseInt(dayIndex);
            const slots = 1; // Single slot like subjects
            const endTime = calculateEndTime(time, slots, parsedDayIndex);

            if (!isWithinDayBounds(time, endTime, parsedDayIndex)) {
                setError("Cannot place break beyond day's end time!");
                return;
            }

            if (hasScheduleConflict(destination.droppableId, time, endTime)) {
                setError("This slot conflicts with an existing schedule!");
                return;
            }

            const newSchedule = {
                ...schedule,
                [destination.droppableId]: {
                    type: 'break',
                    name: 'Istirahat',
                    startTime: time,
                    endTime,
                    slots,
                    height: CELL_HEIGHT,
                    width: 300,
                    isResizable: true,
                    duration: durationPerSlot
                }
            };

            setSchedule(newSchedule);
            setError("");
            return;
        }

        // Handle subject drop (existing code)
        if (source.droppableId === "subjects" && destination.droppableId.startsWith("schedule")) {
            const [_, time, dayIndex] = destination.droppableId.split("-");
            const selectedTeacher = activeSubjectTeachers[source.index];
            const daySlots = timeSlotsPerDay[parseInt(dayIndex)].slots;

            // Validation checks
            if (!daySlots.includes(time)) {
                setError("Invalid time slot selected!");
                return;
            }

            const slots = 1;
            const endTime = calculateEndTimeWithBreaks(time, slots, parseInt(dayIndex));

            if (!isWithinDayBounds(time, endTime, parseInt(dayIndex))) {
                setError("Cannot place subject beyond day's end time!");
                return;
            }

            if (hasScheduleConflict(destination.droppableId, time, endTime)) {
                setError("This slot conflicts with an existing schedule!");
                return;
            }

            // Create schedule item with complete information
            const newSchedule = {
                ...schedule,
                [destination.droppableId]: {
                    subject: `${selectedTeacher.subject.name} - ${selectedTeacher.teacher.name}`,
                    subjectDetail: {
                        code: selectedTeacher.subject.code,
                        type: selectedTeacher.subject.type,
                        teacherName: selectedTeacher.teacher.name,
                        teacherId: selectedTeacher.id  // Use the subject_teacher ID directly
                    },
                    startTime: time,
                    endTime: endTime,
                    slots,
                    height: slots * 100, // Adjusted initial height
                    width: 300,         // Adjusted width
                    isResizable: true,
                }
            };

            setSchedule(newSchedule);
            setError(""); // Clear any existing errors
        }
    };

    const calculateBreakEndTime = (startTime: string, duration: number): string => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + duration;
        const endHours = Math.floor(totalMinutes / 60);
        const endMinutes = totalMinutes % 60;
        return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    };

    const handleBreakDurationConfirm = (duration: number) => {
        if (!pendingBreakData) return;
        const { destination, time, dayIndex } = pendingBreakData;

        // Calculate break end time
        const endTime = calculateBreakEndTime(time, duration);

        // Validate the break time
        if (!isWithinDayBounds(time, endTime, dayIndex)) {
            setError("Istirahat tidak boleh melewati batas waktu hari!");
            return;
        }

        if (hasScheduleConflict(destination.droppableId, time, endTime)) {
            setError("Waktu istirahat bertabrakan dengan jadwal yang ada!");
            return;
        }

        // Add break schedule
        const breakScheduleKey = destination.droppableId;
        const newSchedule = { ...schedule };

        // Add break time
        newSchedule[breakScheduleKey] = {
            type: 'break',
            name: 'Istirahat',
            startTime: time,
            endTime,
            slots: Math.ceil(duration / durationPerSlot),
            height: Math.ceil(duration / durationPerSlot) * CELL_HEIGHT,
            width: 300,
            isResizable: true,
            duration,
            isBreak: true
        };

        // Adjust all subsequent schedules
        Object.entries(schedule).forEach(([key, item]) => {
            const [_, itemTime, itemDayIndex] = key.split("-");
            if (parseInt(itemDayIndex) === dayIndex && itemTime >= endTime) {
                // Move this schedule to start after the break
                const newStartTime = getNextAvailableTime(endTime);
                const duration = calculateDuration(item.startTime, item.endTime, dayIndex);
                const newEndTime = calculateBreakEndTime(newStartTime, duration * durationPerSlot);

                const newKey = `schedule-${newStartTime}-${itemDayIndex}`;
                newSchedule[newKey] = {
                    ...item,
                    startTime: newStartTime,
                    endTime: newEndTime
                };
                delete newSchedule[key];
            }
        });

        setSchedule(newSchedule);
        setError("");
        setPendingBreakData(null);
        setIsBreakDialogOpen(false);
    };

    const handleResizeStart = () => setResizing(true);

    const handleResize = (cellKey: string, e: any, { size }: { size: { height: number; width: number } }) => {
        const newSchedule = { ...schedule };
        const currentCell = newSchedule[cellKey];
        if (!currentCell) return;

        // Snap to grid - memastikan tinggi selalu kelipatan CELL_HEIGHT
        const slots = Math.round(size.height / CELL_HEIGHT);
        const snappedHeight = slots * CELL_HEIGHT;

        const dayIndex = parseInt(cellKey.split("-")[2]);
        const startTime = currentCell.startTime;

        const endTime = calculateEndTime(startTime, slots, dayIndex);

        if (!isWithinDayBounds(startTime, endTime, dayIndex) ||
            hasScheduleConflict(cellKey, startTime, endTime)) {
            return;
        }

        newSchedule[cellKey] = {
            ...currentCell,
            slots,
            height: snappedHeight, // Gunakan tinggi yang sudah di-snap
            endTime,
            isResizable: true,
        };

        setSchedule(newSchedule);
    };

    const handleResizeStop = (cellKey: string, e: any, { size }: { size: { height: number; width: number } }) => {
        const slots = Math.max(1, Math.round(size.height / CELL_HEIGHT));
        const dayIndex = parseInt(cellKey.split("-")[2]);
        const currentCell = schedule[cellKey];
        if (!currentCell) return;

        const startTime = currentCell.startTime;
        const endTime = calculateEndTime(startTime, slots, dayIndex);

        // Validasi final
        if (!isWithinDayBounds(startTime, endTime, dayIndex) ||
            hasScheduleConflict(cellKey, startTime, endTime)) {
            // Reset ke state terakhir yang valid
            setSchedule({
                ...schedule,
                [cellKey]: {
                    ...currentCell,
                    slots: currentCell.slots,
                    height: currentCell.slots * CELL_HEIGHT,
                    endTime: currentCell.endTime,
                    isResizable: true, // Pastikan tetap resizable
                    type: currentCell.type, // Pertahankan type
                    subject: currentCell.subject, // Pertahankan subject
                    subjectDetail: currentCell.subjectDetail // Pertahankan subjectDetail
                }
            });
            return;
        }

        // Create the updated schedule first
        const updatedSchedule = {
            ...schedule,
            [cellKey]: {
                ...currentCell, // Pertahankan semua properti yang ada
                slots,
                height: slots * CELL_HEIGHT,
                endTime,
                isResizable: true, // Pastikan tetap resizable
            }
        };

        // Update state
        setResizing(false);
        setError("");
        setSchedule(updatedSchedule);
    };

    const prepareScheduleRequest = (
        schedule: Record<string, ScheduleItem>,
        classroom_id: string | null
    ): ClassSubjectRequest[] => {
        console.log('Preparing schedule request from:', schedule);

        const requests = Object.entries(schedule).map(([key, item]) => {
            const [_, time, dayIndex] = key.split('-');
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
            // Get the day from daySchedules or use a typed fallback
            const day = daySchedules[parseInt(dayIndex)]?.originalDay as
                "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

            console.log(`Processing schedule item:`, {
                key,
                dayIndex,
                mappedDay: day,
                item
            });

            // Check if the item is a break schedule
            if (item.type === 'break') {
                return {
                    subject_teacher_id: null,
                    classroom_id,
                    type: 'break' as const,
                    name: 'Break',
                    day,
                    start_time: item.startTime,
                    end_time: item.endTime,
                    status: true
                };
            }

            // For regular subjects
            const request: ClassSubjectRequest = {
                subject_teacher_id: item.subjectDetail?.teacherId || '',
                classroom_id,
                type: 'subject' as const,
                name: item.subjectDetail?.code ?? '',
                day,
                start_time: item.startTime,
                end_time: item.endTime,
                status: true
            };

            console.log('Created request:', request);
            return request;
        });

        console.log('Final requests:', requests);
        return requests;
    };

    const getEndTimeDisplay = (startTime: string, dayIndex: number) => {
        const daySlots = timeSlotsPerDay[dayIndex].slots;
        const currentIndex = daySlots.indexOf(startTime);
        if (currentIndex < daySlots.length - 1) {
            return daySlots[currentIndex + 1];
        }
        return startTime;
    };

    const handleRemoveSchedule = (cellKey: string) => {
        const newSchedule = { ...schedule };
        delete newSchedule[cellKey];
        setSchedule(newSchedule);
    };

    // Add these new utility functions
    const calculateEndTimeWithBreaks = (startTime: string, slots: number, dayIndex: number): string => {
        const duration = slots * durationPerSlot;
        const [hours, minutes] = startTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + duration;
        const endHours = Math.floor(totalMinutes / 60);
        const endMinutes = totalMinutes % 60;
        return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    };

    const getNextAvailableTime = (time: string): string => {
        const [hours, minutes] = time.split(':').map(Number);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    return {
        // State
        schedule,
        resizing,
        error,
        daySchedules,
        activeSubjectTeachers,
        subjectList,
        timeSlotsPerDay,
        allTimeSlots,
        breakSchedules,
        classroom,
        classrooms,
        isBreakDialogOpen,
        setIsBreakDialogOpen,

        // Methods
        setSchedule,
        setResizing,
        setError,
        setSubjectList,
        isBreakTime,
        calculateEndTime,
        calculateDuration,
        isWithinDayBounds,
        hasScheduleConflict,
        calculateMaxHeight,
        handleDragEnd,
        handleResizeStart,
        handleResize,
        handleResizeStop,
        getEndTimeDisplay,
        handleRemoveSchedule,
        handleBreakDurationConfirm,
        handleSaveSchedule,
        processing,
    };
};
