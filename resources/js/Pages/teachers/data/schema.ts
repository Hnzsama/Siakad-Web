import { attendanceSchema } from '@/Pages/attendances/data/schema';
import { classroomSchema, classroomWithouthomeroomTeacherSchema } from '@/Pages/classrooms/data/schema';
import { shiftSchema } from '@/Pages/shifts/data/schema';
import { Student } from '@/Pages/students/data/schema';
import { subjectSchema } from '@/Pages/subjects/data/schema';
import { User } from '@/Pages/users/data/schema';
import { PageProps } from '@/types';
import { baseClassroomSchema, baseTeacherSchema, baseUserSchema } from '@/types/app/base-schemas';
import { PaginatedResponse } from '@/types/app/paginate';
import { basicClassSubjectSchema, basicTeacherSchema } from '@/types/app/shared-schemas';
import { z } from 'zod'

export const classSubjectSchema = basicClassSubjectSchema

export const teacherSchema = basicTeacherSchema.extend({
    homeroom_teacher: classroomWithouthomeroomTeacherSchema.nullable().optional(),
    subjects: subjectSchema.array().nullable().optional(),
    class_subjects: classSubjectSchema.array().nullable().optional(),
    attendances: attendanceSchema.array().nullable().optional(),
});

export type Teacher = z.infer<typeof teacherSchema>

export interface TeachersResponse extends PageProps {
    teachers: Teacher[];
    auth: {
        user: User;
    };
}

export interface TeacherShowResponse extends PageProps {
    teacher?: Teacher;
    teachers?: Teacher[];
    students?: Student[];
    auth: {
        user: User;
    };
}

export interface SelectResponse extends PageProps {
  shifts: z.infer<typeof shiftSchema>[];
}

export type FormData = Omit<Teacher,
    | 'id'
    | 'user_id'
    | 'created_at'
    | 'updated_at'
    | 'deleted_at'
    | 'selectedIds'
    | 'user'
    | 'shift'
    | 'homeroom_teacher'
>

export type FormProfile = Omit<Teacher,
    | 'id'
    | 'user_id'
    | 'shift_id'
    | 'created_at'
    | 'updated_at'
    | 'deleted_at'
    | 'selectedIds'
    | 'user'
    | 'shift'
    | 'homeroom_teacher'
>

export type Exportable = Omit<Teacher,
    | 'id'
    | 'user_id'
    | 'shift_id'
    | 'updated_at'
    | 'deleted_at'
    | 'selectedIds'
    | 'user'
    | 'shift'
    | 'homeroom_teacher'
>
