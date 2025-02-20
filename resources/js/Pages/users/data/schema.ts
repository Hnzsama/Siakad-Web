import { classroomSchema } from '@/Pages/classrooms/data/schema';
import { guardianSchema } from '@/Pages/guardians/data/schema';
import { semesterSchema } from '@/Pages/semesters/data/schema';
import { studentSchema } from '@/Pages/students/data/schema';
import { teacherSchema } from '@/Pages/teachers/data/schema';
import { PageProps } from '@/types';
import { baseUserSchema } from '@/types/app/base-schemas';
import { Method } from '@/types/app/method';
import { z } from 'zod'

const permissionSchema = z.object({
    id: z.number(),
    name: z.string(),
    guard_name: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    pivot: z.object({
        role_id: z.number(),
        permission_id: z.number(),
    }).optional(),
});

const roleSchema = z.object({
    id: z.number(),
    name: z.string(),
    guard_name: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    pivot: z.object({
        model_type: z.string(),
        model_id: z.string(),
        role_id: z.number(),
    }).optional(),
    permissions: z.array(permissionSchema).optional(),
});

export const userSchema = baseUserSchema.extend({
    roles: z.array(roleSchema).optional(),
    student: studentSchema.optional(),
    teacher: teacherSchema.optional(),
    guardian: guardianSchema.optional(),
});

export type User = z.infer<typeof userSchema>

export interface UsersResponse extends PageProps {
    users: User[];
    auth: {
        user: User;
    };
}

export type UpdateProfileSchema = {
    _method: Method;
    name: string;
    email: string;
    phone: string;
    avatar_url: File | null;
}

export type UpdatePasswordSchema = {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export type ResetPasswordSchema = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export type RegisterUserSchema = {
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
}

export type LoginUserSchema = {
    email: string,
    password: string,
    remember: boolean,
}
