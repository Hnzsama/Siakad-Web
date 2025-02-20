import { z } from 'zod';
import { Student, studentSchema } from '@/Pages/students/data/schema';
import { Teacher, teacherSchema } from '@/Pages/teachers/data/schema';
import { PageProps } from '@/types';
import { User, userSchema } from '@/Pages/users/data/schema';
import { baseLeaveRequestSchema, baseStudentSchema } from '@/types/app/base-schemas';
import { LeaveType, leaveTypeSchema } from '@/Pages/leaveTypes/data/schema';
import { semesterSchema } from '@/Pages/semesters/data/schema';

export const leaveRequestSchema = baseLeaveRequestSchema.extend({
    leavable: baseStudentSchema
        .pick({ id: true, nis: true, name: true })
        .or(teacherSchema.pick({ id: true, nip: true, name: true })),
    semester: z.object({
        id: z.string().uuid(),
        name: z.string()
    }),
    leave_type: z.object({
        id: z.string().uuid(),
        leave_name: z.string()
    }),
    approver: userSchema.nullable().optional(),
    repellent: userSchema.nullable().optional(),
});

export const leaveRequestFullSchema = baseLeaveRequestSchema.extend({
    leavable: baseStudentSchema
        .or(teacherSchema),
    semester: semesterSchema,
    leave_type: leaveTypeSchema,
    approver: userSchema.nullable().optional(),
    repellent: userSchema.nullable().optional(),
});

export const basicLeaveRequestSchema = z.object({
    id: z.string().uuid(),
    start_date: z.string(),
    end_date: z.string(),
    status: z.enum(['Pending', 'Approved', 'Rejected']),
    reason: z.string(),
    attachment_url: z.string().nullable(),
    leave_type_id: z.string().uuid(),
});

export type BasicLeaveRequest = z.infer<typeof basicLeaveRequestSchema>;

export type LeaveRequest = z.infer<typeof leaveRequestSchema>;
export type FullLeaveRequest = z.infer<typeof leaveRequestFullSchema>;

export interface LeaveRequestResponse extends PageProps {
    leaveRequests: LeaveRequest[];
    auth: {
        user: User;
    };
}

export interface LeaveRequestShowResponse extends PageProps {
    leaveRequest?: FullLeaveRequest;
    leaveRequests?: FullLeaveRequest[];
    students?: Student[];
    auth: {
        user: User;
    };
}

export interface SelectResponse extends PageProps {
    leaveTypes: LeaveType[];
    students: Student[];
    teachers: Teacher[];
}

export interface FormData {
    leavable_id?: string;
    leavable_type: string;
    leave_type_id: string;
    start_date: string;
    end_date: string;
    reason: string;
    attachment_url: File | null; // Changed from attachment_url to attachment
    status: "Pending" | "Approved" | "Rejected";
}

export interface Exportable {
    leavable_id: string;
    leavable_type: string;
    semester_id: string;
    leave_type_id: string;
    start_date: string;
    end_date: string;
    reason: string;
    attachment_url: string | null;
    status: 'Pending' | 'Approved' | 'Rejected';
    approved_by: string | null;
    rejected_at: string | null;
    rejection_reason: string | null;
    rejected_by: string | null;
    created_at: string;
    updated_at: string;
    leavable: {
        id: string;
        name: string;
        nis?: string;
        nip?: string;
    };
    semester: {
        id: string;
        name: string;
    };
    leave_type: {
        id: string;
        leave_name: string;
    };
    approver_name?: string | null;
    repellent_name?: string | null;
}
