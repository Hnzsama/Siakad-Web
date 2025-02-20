import { semesterSchema } from '@/Pages/semesters/data/schema';
import { Student, studentSchema } from '@/Pages/students/data/schema';
import { userSchema } from '@/Pages/users/data/schema';
import { ViolationType, violationTypeSchema } from '@/Pages/violationTypes/data/schema';
import { PageProps } from '@/types';
import { User } from '@/Pages/users/data/schema';
import { z } from 'zod';
import { baseViolationSchema } from '@/types/app/base-schemas';

export const violationSchema = baseViolationSchema.extend({
    student: studentSchema.pick({ id: true, nis: true, name: true }),
    semester: semesterSchema,
    violation_type: violationTypeSchema,
    creator: userSchema,
    approver: userSchema.nullable().optional(),
    canceller: userSchema.nullable().optional(),
    updater: userSchema.nullable().optional(),
});

export type BasicViolation = z.infer<typeof baseViolationSchema>;

// Define the type for a single violation
export type Violation = z.infer<typeof violationSchema>;

// Define the response interface
export interface ViolationResponse extends PageProps {
    violations: Violation[];
    auth: {
        user: User;
    };
}

export interface ViolationShowResponse extends PageProps {
    violation?: Violation;
    violations?: Violation[];
    students?: Student[];
    auth: {
        user: User;
    };
}

export interface SelectResponse extends PageProps {
    violationTypes: ViolationType[];
    students: Student[];
}

export interface FilterResponse extends PageProps {
    violationTypes: ViolationType[];
}

// Define form data type (excluding computed/auto-generated fields)
export interface FormData {
    student_id: string;
    violation_type_id: string;
    violation_date: string;
    description: string;
    document_path?: string | null;
    sanction_start_date?: string | null;
    sanction_end_date?: string | null;
    sanction_notes?: string | null;
    status: 'pending' | 'approved' | 'cancelled';
}

// Define exportable type (for CSV/Excel exports)
export type Exportable = {
    'Nama Siswa': string;
    'NIS': string;
    'Semester': string;
    'Jenis Pelanggaran': string;
    'Tanggal Pelanggaran': string;
    'Status': string;
    'Deskripsi': string;
    'Catatan Sanksi': string;
    'Tanggal Mulai Sanksi': string;
    'Tanggal Selesai Sanksi': string;
    'Dibuat Oleh': string;
    'Disetujui Oleh': string;
    'Dibatalkan Oleh': string;
    'Alasan Pembatalan': string;
};
