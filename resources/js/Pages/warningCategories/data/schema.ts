import { PageProps } from '@/types';
import { User } from '@/Pages/users/data/schema';
import { z } from 'zod';

export const warningCategorySchema = z.object({
    id: z.string().uuid(),
    category_name: z.string(),
    description: z.string().nullable().optional(),
    level: z.number(),
    warnings_count: z.number().nullable().optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    selectedIds: z.array(z.string()).nullable().optional(),
});

export type WarningCategory = z.infer<typeof warningCategorySchema>;

export interface WarningCategoryResponse extends PageProps {
    warningCategories: WarningCategory[];
    auth: {
        user: User;
    };
}

export type FormData = Omit<WarningCategory,
    | 'id'
    | 'warnings_count'
    | 'created_at'
    | 'updated_at'
    | 'selectedIds'
>;

export type Exportable = Omit<WarningCategory,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'selectedIds'
>;
