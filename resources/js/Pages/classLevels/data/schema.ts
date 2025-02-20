import { PageProps } from '@/types';
import { User } from '@/Pages/users/data/schema';
import { z } from 'zod';

export const classLevelSchema = z.object({
    id: z.string().uuid(),
    alphabet: z.string(),
    level: z.number(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    selectedIds: z.array(z.string()).nullable().optional(),
});

export type ClassLevel = z.infer<typeof classLevelSchema>;

export interface ClassLevelResponse extends PageProps {
    classLevels: ClassLevel[];
    auth: {
        user: User;
    };
}

export type FormData = Omit<ClassLevel,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'selectedIds'
>

export type Exportable = Omit<ClassLevel,
    | 'id'
    | 'updated_at'
    | 'selectedIds'
>
