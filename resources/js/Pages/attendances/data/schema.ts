import { studentSchema } from '@/Pages/students/data/schema';
import { teacherSchema } from '@/Pages/teachers/data/schema';
import { User } from '@/Pages/users/data/schema';
import { PageProps } from '@/types';
import { basicStudentSchema, basicTeacherSchema } from '@/types/app/shared-schemas';
import { z } from 'zod';

export const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export const attendanceSchema = z.object({
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
    attendable: basicStudentSchema
        .pick({ id: true, nis: true, name: true })
        .or(basicTeacherSchema.pick({ id: true, nip: true, name: true })),
});

export type Attendance = z.infer<typeof attendanceSchema>;

export interface AttendanceResponse extends PageProps {
    attendances: Attendance[];
    auth: {
        user: User;
    };
}

export interface MonthlyResponse extends PageProps {
    attendances: {
        [month: string]: {
            [day: string]: Array<{
                time: string;
                type: 'MASUK' | 'PULANG';
                status: 'Present' | 'Late' | 'Absent' | 'Permission' | 'Sick';
            }>;
        };
    };
    year: string;
    auth: {
        user: User;
    };
}

// Definisi tipe untuk status kehadiran
export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Permission' | 'Sick';

// Definisi tipe untuk record kehadiran (MASUK atau PULANG)
export interface AttendanceRecord {
    time: string;
    type: 'MASUK' | 'PULANG';
    status: AttendanceStatus;
}

// Definisi tipe untuk absensi seorang siswa pada hari tertentu
export interface StudentAttendance {
    [day: string]: AttendanceRecord[];
}

// Definisi tipe untuk informasi siswa beserta absensinya
export interface StudentWithAttendance {
    students: string[];
    attendances: {
        [studentName: string]: StudentAttendance;
    };
}

// Definisi tipe untuk keseluruhan respons dari fungsi classroomMonthly
export interface ClassroomMonthlyResponse extends PageProps {
    attendances: {
        [className: string]: StudentWithAttendance;
    };
    year: string;
    month: string;
    auth: {
        user: User;
    };
}

export type FormData = Omit<Attendance,
    | 'id'
    | 'photo_path'
    | 'semester_id'
    | 'created_at'
    | 'updated_at'
    | 'selectedIds'
    | 'attendable'
> & {
    photo_path: File | null
};

export type Exportable = Omit<Attendance,
    | 'id'
    | 'updated_at'
    | 'selectedIds'
>;
