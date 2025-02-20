import { classroomSchema } from '@/Pages/classrooms/data/schema';
import { studentSchema } from '@/Pages/students/data/schema';
import { User, userSchema } from '@/Pages/users/data/schema';
import { PageProps } from '@/types';
import { baseGuardianSchema, baseStudentSchema, baseUserSchema } from '@/types/app/base-schemas';
import { date, z } from 'zod';

// Define a minimal student schema for the guardian context
const guardianStudentSchema = baseStudentSchema.pick({
    id: true,
    nis: true,
    name: true,
    status: true,
    enrollment_date: true,
}).extend({
    classroom: classroomSchema.nullable().optional()
});

export const guardianSchema = baseGuardianSchema.extend({
    user: baseUserSchema,
    children: z.array(guardianStudentSchema).nullable().optional()
});

export type Guardian = z.infer<typeof guardianSchema>;

export interface GuardianResponse extends PageProps {
    guardians: Guardian[];
    auth: {
        user: User;
    };
}

export interface GuardianShowResponse extends PageProps {
    guardian: Guardian;
    auth: {
        user: User;
    };
}

export type FormData = Omit<Guardian,
    | 'id'
    | 'user_id'
    | 'updated_at'
    | 'deleted_at'
    | 'selectedIds'
    | 'user'
    | 'children'
>

export type FormProfile = Omit<Guardian,
    | 'id'
    | 'user_id'
    | 'created_at'
    | 'updated_at'
    | 'deleted_at'
    | 'selectedIds'
    | 'user'
    | 'children'
>

export type Exportable = Omit<Guardian,
    | 'id'
    | 'user_id'
    | 'updated_at'
    | 'deleted_at'
    | 'selectedIds'
    | 'user'
    | 'children'
>
