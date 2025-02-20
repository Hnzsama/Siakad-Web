import { School } from '@/Pages/schools/data/schema';
import { subjectSchema } from '@/Pages/subjects/data/schema';
import { teacherSchema } from '@/Pages/teachers/data/schema';
import { PageProps } from '@/types';
import { User } from '@/Pages/users/data/schema';
import { z } from 'zod';
import { baseSubjectTeacherSchema } from '@/types/app/base-schemas';
import { basicSubjectTeacherSchema } from '@/types/app/shared-schemas';

export const subjectTeacherSchema = basicSubjectTeacherSchema;

export type SubjectTeacher = z.infer<typeof subjectTeacherSchema>;

export interface SubjectTeacherResponse extends PageProps {
    subjectTeachers: SubjectTeacher[];
    auth: {
        user: User;
    };
}

export interface FilterResponse extends SubjectTeacherResponse {
    subjects: z.infer<typeof subjectSchema>[];
    teachers: z.infer<typeof teacherSchema>[];
}

export interface SelectResponse extends SubjectTeacherResponse {
    subjects: z.infer<typeof subjectSchema>[];
    teachers: z.infer<typeof teacherSchema>[];
}

export type FormData = Omit<SubjectTeacher,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'selectedIds'
    | 'subject'
    | 'teacher'
>

export type Exportable = Omit<SubjectTeacher,
    | 'id'
    | 'updated_at'
    | 'selectedIds'
>
