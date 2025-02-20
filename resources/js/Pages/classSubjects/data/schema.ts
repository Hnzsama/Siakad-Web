import { PageProps } from '@/types';
import { User } from '@/Pages/users/data/schema';
import { z } from 'zod';
import { Teacher, teacherSchema } from '@/Pages/teachers/data/schema';
import { Classroom, classroomSchema } from '@/Pages/classrooms/data/schema';
import { Subject, subjectSchema } from '@/Pages/subjects/data/schema';
import { subjectTeacherSchema } from '@/Pages/subjectTeachers/data/schema';
import { baseClassSubjectSchema, DayEnum } from '@/types/app/base-schemas';
import { basicClassSubjectSchema, basicSubjectTeacherSchema } from '@/types/app/shared-schemas';

export const groupedClassSubjectSchema = z.object({
    id: z.string().uuid(),
    subject_teacher_id: z.string().uuid().nullable().optional(),
    classroom_id: z.string().uuid().nullable().optional(),
    day: DayEnum,
    start_time: z.string(),
    end_time: z.string(),
    status: z.any(),
    classroom: z.object({
        id: z.string().uuid(),
        name: z.string(),
    }),
    subjects: z.array(z.object({
        id: z.string().uuid(),
        subject_teacher: z.object({
            id: z.string().uuid(),
            subject: subjectSchema.nullable().optional(),
            teacher: teacherSchema.omit({ user: true, shift: true }).nullable().optional()
        }).nullable().optional(),
        day: DayEnum,
        start_time: z.string(),
        end_time: z.string(),
        status: z.number()
    })).nullable().optional(),
    selectedIds: z.array(z.string()).nullable().optional()
});

export const classSubjectSchema = basicClassSubjectSchema

export type GroupedClassSubject = z.infer<typeof groupedClassSubjectSchema>;

export type ClassSubject = z.infer<typeof classSubjectSchema>;

export interface ClassSubjectResponse extends PageProps {
    classSubjects: ClassSubject[];
    groupedClassSubjects: GroupedClassSubject[];
    classrooms: Classroom[]
    auth: {
        user: User;
    };
}

export interface AllPropsResponse extends ClassSubjectResponse {
    subjectTeachers: z.infer<typeof subjectTeacherSchema>[]
    classroom: z.infer<typeof classroomSchema>
    classrooms: z.infer<typeof classroomSchema>[]
    subjects: z.infer<typeof subjectSchema>[]
    teachers: z.infer<typeof teacherSchema>[]
}

export interface FilterResponse extends ClassSubjectResponse {
    teachers: z.infer<typeof teacherSchema>[]
    classrooms: z.infer<typeof classroomSchema>[]
    subjects: z.infer<typeof subjectSchema>[]
}

export interface SelectResponse extends ClassSubjectResponse {
    subjectTeachers: z.infer<typeof subjectTeacherSchema>[]
    classrooms: z.infer<typeof classroomSchema>[]
}

export interface CreateResponse extends ClassSubjectResponse {
    subjectTeachers: z.infer<typeof subjectTeacherSchema>[]
    classroom: z.infer<typeof classroomSchema>
    classrooms: z.infer<typeof classroomSchema>[]
    subjects: z.infer<typeof subjectSchema>[]
    teachers: z.infer<typeof teacherSchema>[]
}

export type FormData = {
    subject_teacher_id: string;
    classroom_id: string;
    day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
    start_time: string;
    end_time: string;
    deafult_duration?: number | null;
    status: boolean;
}

export type Exportable = Omit<ClassSubject,
    | 'id'
    | 'updated_at'
    | 'selectedIds'
>

export type Day = z.infer<typeof DayEnum>;
