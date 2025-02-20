import { PageProps } from '@/types';
import { User } from '@/Pages/users/data/schema';
import { z } from 'zod';

export const majorSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    status: z.any(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    selectedIds: z.array(z.string()).nullable().optional(),
});

export type Major = z.infer<typeof majorSchema>;

export interface MajorResponse extends PageProps {
    majors: Major[];
    auth: {
        user: User;
    };
}

export type FormData = Omit<Major,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'selectedIds'
>

export type Exportable = Omit<Major,
    | 'id'
    | 'updated_at'
    | 'selectedIds'
    | 'selectedIds'
>
