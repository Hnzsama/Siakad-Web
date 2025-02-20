import { Attendance } from '@/Pages/attendances/data/schema';
import { classLevelSchema } from '@/Pages/classLevels/data/schema';
import { majorSchema } from '@/Pages/majors/data/schema';
import { shiftSchema } from '@/Pages/shifts/data/schema';
import { studyGroupSchema } from '@/Pages/studyGroups/data/schema';
import { Teacher, teacherSchema } from '@/Pages/teachers/data/schema';
import { User } from '@/Pages/users/data/schema';
import { PageProps } from '@/types';
import { baseClassroomSchema, baseStudentSchema, baseTeacherSchema } from '@/types/app/base-schemas';
import { z } from 'zod';

export const classroomSchema = baseClassroomSchema.extend({
    homeroom_teacher: baseTeacherSchema.nullable(),
    students: baseStudentSchema.array().nullable().optional(),
    class_level: classLevelSchema,
    study_group: studyGroupSchema,
    shift: shiftSchema.nullable(),
    major: majorSchema.nullable()
});

export const classroomWithouthomeroomTeacherSchema = baseClassroomSchema.extend({
    students: baseStudentSchema.array().nullable().optional(),
    class_level: classLevelSchema,
    study_group: studyGroupSchema,
    shift: shiftSchema,
    major: majorSchema.nullable()
})

export type Classroom = z.infer<typeof classroomSchema>;

export interface ClassroomResponse extends PageProps {
    classrooms: Classroom[];
    auth: {
        user: User;
    };
}

export interface ClassroomShowResponse extends PageProps {
    classroom: Classroom;
    attendances: Attendance[];
    average: number;
    percentage: {
        percentage: number;
        total: number;
        present: number;
    }
    auth: {
        user: User;
    };
}

export interface SelectResponse extends ClassroomResponse {
    teachers: z.infer<typeof teacherSchema>[];
    classLevels: z.infer<typeof classLevelSchema>[];
    studyGroups: z.infer<typeof studyGroupSchema>[];
    shifts: z.infer<typeof shiftSchema>[];
    majors: z.infer<typeof majorSchema>[];
}

export type FormData = Omit<Classroom,
    | 'id'
    | 'name'
    | 'created_at'
    | 'updated_at'
    | 'selectedIds'
    | 'homeroom_teacher'
    | 'class_level'
    | 'study_group'
    | 'shift'
    | 'major'
>;

export type Exportable = Omit<Classroom,
    | 'id'
    | 'updated_at'
    | 'created_at'
    | 'selectedIds'
>;
