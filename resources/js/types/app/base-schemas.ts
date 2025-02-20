import { z } from 'zod';

export const DayEnum = z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);

// Define the status enum to match the database
export const ViolationStatus = {
    Pending: 'Pending',
    InProgress: 'In Progress',
    Resolved: 'Resolved',
    Cancelled: 'Cancelled',
} as const;

export const baseUserSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    email_verified_at: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    password: z.string().nullable().optional(),
    avatar_url: z.string().optional().nullable(),
    status: z.any(),
    created_at: z.string(),
    updated_at: z.string(),
    selectedIds: z.array(z.string()).nullable().optional(),
});

export const baseTeacherSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    shift_id: z.string().uuid(),
    name: z.string(),
    nip: z.string(),
    gender: z.enum(['Male', 'Female']),
    place_of_birth: z.string(),
    date_of_birth: z.string(),
    highest_education: z.string().nullable(),
    major: z.string().nullable(),
    university: z.string().nullable(),
    certification: z.string().nullable(),
    address: z.string(),
    phone: z.string().nullable(),
    email: z.string().email(),
    position: z.string().nullable(),
    subject: z.string().nullable(),
    year_started: z.string().or(z.number()),
    year_ended: z.string().or(z.number()).nullable(),
    work_experience: z.string().nullable(),
    status: z.any(),
    deleted_at: z.string().nullable(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    selectedIds: z.array(z.string()).nullable().optional(),
});

export const baseStudentSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    semester_id: z.string().uuid(),
    guardian_id: z.string().uuid().nullable().optional(),
    classroom_id: z.string().uuid().nullable().optional(),
    name: z.string(),
    nik: z.string(),
    nis: z.string(),
    gender: z.enum(['Male', 'Female']),
    place_of_birth: z.string(),
    date_of_birth: z.string(),
    address: z.string(),
    phone: z.string().nullable(),
    email: z.string().email(),
    status: z.enum(['Active', 'Graduated', 'Dropped Out']),
    enrollment_date: z.string(),
    graduation_date: z.string().nullable(),
    violation_points: z.number().default(100),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    deleted_at: z.string().datetime().nullable(),
    selectedIds: z.array(z.string()).nullable().optional(),
});

export const baseGuardianSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    name: z.string(),
    relationship: z.enum(['Father', 'Mother', 'Guardian', 'Other']),
    nik: z.string(),
    phone: z.string(),
    email: z.string().email(),
    date_of_birth: z.string(),
    address: z.string(),
    gender: z.enum(['Male', 'Female']),
    occupation: z.string().nullable(),
    income: z.string().nullable(),
    status: z.any(),
    deleted_at: z.string().nullable(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    selectedIds: z.array(z.string()).nullable().optional(),
});

export const baseClassroomSchema = z.object({
    id: z.string().uuid(),
    teacher_id: z.string().uuid().nullable().optional(),
    class_level_id: z.string().uuid(),
    study_group_id: z.string().uuid(),
    shift_id: z.string().uuid(),
    major_id: z.string().uuid().nullable(),
    name: z.string(),
    room_number: z.string().nullable(),
    status: z.any(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    selectedIds: z.array(z.string()).nullable().optional(),
});

export const baseSubjectTeacherSchema = z.object({
    id: z.string().uuid(),
    subject_id: z.string().uuid(),
    teacher_id: z.string().uuid(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    selectedIds: z.array(z.string()).nullable().optional(),
});

export const baseClassSubjectSchema = z.object({
    id: z.string().uuid(),
    subject_teacher_id: z.string().uuid(),
    classroom_id: z.string().uuid().nullable().optional(),
    type: z.enum(['subject', 'break']).optional(),  // Add type field
    name: z.string().optional(),                    // Add name field
    day: DayEnum,
    start_time: z.string(),
    end_time: z.string(),
    status: z.any(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    selectedIds: z.array(z.string()).nullable().optional(),
});

export const baseAttendanceSchema = z.object({
    id: z.string().uuid(),
    attendable_id: z.string().uuid(),
    attendable_type: z.string(),
    semester_id: z.string().uuid(),
    date: z.string(),
    check_in: z.string().nullable(),
    check_out: z.string().nullable(),
    status: z.enum(['Present', 'Late', 'Absent', 'Permission', 'Sick']),
    location_latitude: z.string().nullable(),
    location_longitude: z.string().nullable(),
    device_info: z.string().nullable(),
    photo_path: z.string().nullable(),
    notes: z.string().nullable(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    selectedIds: z.array(z.string()).nullable().optional(),
});

export const baseWarningLetterSchema = z.object({
    id: z.string().uuid(),
    letter_number: z.string(),
    student_id: z.string().uuid(),
    semester_id: z.string().uuid(),
    warning_category_id: z.string().uuid(),
    issued_date: z.string(),
    description: z.string(),
    document_path: z.string().nullable(),
    parent_id: z.string().uuid(),
    parent_received_at: z.string().nullable(),
    parent_signature_path: z.string().nullable(),
    follow_up_date: z.string().nullable(),
    follow_up_notes: z.string().nullable(),
    cancelled_at: z.string().nullable(),
    cancellation_reason: z.string().nullable(),
    cancelled_by: z.string().uuid().nullable(),
    cancellation_document_path: z.string().nullable(),
    approved_by: z.string().uuid().nullable(),
    created_by: z.string().uuid(),
    updated_by: z.string().uuid().nullable(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    status: z.enum(['pending', 'approved', 'cancelled']),
    selectedIds: z.array(z.string()).nullable().optional(),
});

export const baseLeaveRequestSchema = z.object({
    id: z.string().uuid(),
    leavable_id: z.string().uuid(),
    leavable_type: z.string(),
    semester_id: z.string().uuid(),
    leave_type_id: z.string().uuid(),
    start_date: z.string(),
    end_date: z.string(),
    reason: z.string(),
    attachment_url: z.string(),
    status: z.enum(['Pending', 'Approved', 'Rejected']),
    approved_by: z.string().uuid().nullable(),
    rejected_at: z.string().nullable(),
    rejection_reason: z.string().nullable(),
    rejected_by: z.string().uuid().nullable(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    selectedIds: z.array(z.string()).nullable().optional(),
});

export const baseViolationSchema = z.object({
    id: z.string().uuid(),
    // Relations
    student_id: z.string().uuid(),
    semester_id: z.string().uuid(),
    violation_type_id: z.string().uuid(),
    // Main data
    violation_date: z.string(), // date string
    description: z.string(),
    document_path: z.string().nullable().optional(),
    // Approval/Cancellation
    status: z.enum(['pending', 'cancelled', 'approved']),
    approved_by: z.string().uuid().nullable().optional(),
    cancelled_at: z.string().nullable().optional(),
    cancellation_reason: z.string().nullable().optional(),
    cancelled_by: z.string().uuid().nullable().optional(),
    // Sanctions
    sanction_start_date: z.string().nullable().optional(), // date string
    sanction_end_date: z.string().nullable().optional(), // date string
    sanction_notes: z.string().nullable().optional(),
    // Audit fields
    created_by: z.string().uuid(),
    updated_by: z.string().uuid().nullable().optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    deleted_at: z.string().datetime().nullable().optional(),
    // Selected IDs for UI purposes
    selectedIds: z.array(z.string()).nullable().optional(),
});
