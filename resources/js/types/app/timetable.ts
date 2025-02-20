export interface ScheduleItem {
    type?: 'subject' | 'break';
    subject?: string;
    subjectDetail?: {
        code: string;
        type: string;
        teacherName: string;
        teacherId: string;
    };
    name?: string; // For break periods
    startTime: string;
    endTime: string;
    slots: number;
    height: number;
    width: number;
    isResizable: boolean;
    duration?: number; // Add duration property for break items
    isBreak?: boolean; // Optional flag to identify break items
}

export interface DaySchedule {
    day: number;
    startTime: string;
    endTime: string;
    name: string;
    originalDay: string;
}

export interface TimeSlot {
    day: number;
    slots: string[];
}

export interface SubjectTeacher {
    id: string;
    created_at: string;
    updated_at: string;
    teacher_id: string;
    subject_id: string;
    subject: {
        id: string;
        name: string;
        created_at: string;
        updated_at: string;
        code: string | null;
        type: "theorical" | "practical";
        description: string | null;
        status?: any;
        selectedIds?: string[] | undefined;
    };
    teacher: {
        id: string;
        name: string;
    };
}

export interface BreakSchedule {
    startTime: string;
    endTime: string;
    name: string;
    duration?: number; // Make duration optional
}

export type ClassSubjectRequest = {
    subject_teacher_id: string | null;
    classroom_id: string | null;
    type: 'subject' | 'break';
    name: string;
    day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
    start_time: string;
    end_time: string;
    status: boolean;
}
