import { PageProps } from '@/types';
import { User } from '@/Pages/users/data/schema';
import { z } from 'zod';

export const subjectSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    type: z.enum(['theorical', 'practical']),
    code: z.string().nullable(),
    description: z.string().nullable(),
    status: z.any(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    selectedIds: z.array(z.string()).nullable().optional(),
});

export type Subject = z.infer<typeof subjectSchema>;

export interface SubjectResponse extends PageProps {
    subjects: Subject[];
    auth: {
        user: User;
    };
}

export type FormData = Omit<Subject,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'selectedIds'
>;

export type Exportable = Omit<Subject,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'selectedIds'
>;
