import { z } from 'zod';
import { PageProps } from '@/types';
import { User } from '@/Pages/users/data/schema';
import { userSchema } from '@/Pages/users/data/schema';
import { Student, studentSchema } from '@/Pages/students/data/schema';
import { guardianSchema } from '@/Pages/guardians/data/schema';
import { semesterSchema } from '@/Pages/semesters/data/schema';
import { WarningCategory, warningCategorySchema } from '@/Pages/warningCategories/data/schema';
import { baseStudentSchema, baseWarningLetterSchema } from '@/types/app/base-schemas';

// Full warning letter schema with relations
export const warningLetterSchema = baseWarningLetterSchema.extend({
    student: baseStudentSchema,
    semester: semesterSchema,
    warning_category: warningCategorySchema,
    parent: guardianSchema,
    repellent: userSchema.nullable(),
    approver: userSchema.nullable(),
    creator: userSchema,
    updater: userSchema.nullable(),
});

export type BasicWarningLetter = z.infer<typeof baseWarningLetterSchema>;

export type WarningLetter = z.infer<typeof warningLetterSchema>;

export interface WarningLetterResponse extends PageProps {
    warningLetters: WarningLetter[];
    auth: {
        user: User;
    };
}

export interface WarningLetterShowResponse extends PageProps {
    warningLetter?: WarningLetter;
    warningLetters?: WarningLetter[];
    students?: Student[]
    filters?: {
        student_id: string;
    }
    auth: {
        user: User;
    };
}

export interface SelectResponse extends PageProps {
    students: Student[];
    warningCategories: WarningCategory[];
}

export type FormData = {
    // Required fields
    letter_number: string;
    student_id: string;
    warning_category_id: string;
    issued_date: string;
    description: string;

    // Optional fields with null
    document_path: File | null;
    parent_received_at: string | null;
    parent_signature_path: string | null;
    follow_up_date: string | null;
    follow_up_notes: string | null;

    // Cancellation fields
    cancelled_at: string | null;
    cancellation_reason: string | null;
    cancelled_by: string;  // Required if cancelled_at is present
    cancellation_document_path: File | null;

    // Approval and audit fields
    approved_by: string | null;
    status: 'pending' | 'approved' | 'cancelled';
}

export type Exportable = Omit<WarningLetter,
    | 'id'
    | 'updated_at'
    | 'deleted_at'
>;
