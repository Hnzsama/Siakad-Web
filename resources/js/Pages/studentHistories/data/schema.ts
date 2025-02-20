import { Classroom, classroomSchema } from '@/Pages/classrooms/data/schema';
import { Semester, semesterSchema } from '@/Pages/semesters/data/schema';
import { studentSchema } from '@/Pages/students/data/schema';
import { PageProps } from '@/types';
import { User } from '@/Pages/users/data/schema';
import { z } from 'zod';

export const studentHistorySchema = z.object({
    id: z.string().uuid(),
    student_id: z.string().uuid(),
    semester_id: z.string().uuid(),
    classroom_id: z.string().uuid(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    selectedIds: z.array(z.string()).nullable().optional(),
    student: studentSchema.pick({ id: true, nis: true, name: true }).nullable().optional(),
    semester: semesterSchema,
    classroom: classroomSchema,
});

export type StudentHistory = z.infer<typeof studentHistorySchema>;

export interface StudentHistoryResponse extends PageProps {
    studentHistories: StudentHistory[];
    auth: {
        user: User;
    };
}

export interface FilterResponse extends StudentHistoryResponse {
    semesters: Semester[];
    classrooms: Classroom[];
}

export type FormData = Omit<StudentHistory,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'selectedIds'
    | 'student'
    | 'semester'
    | 'classroom'
>;

export type Exportable = Omit<StudentHistory,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'selectedIds'
>;
