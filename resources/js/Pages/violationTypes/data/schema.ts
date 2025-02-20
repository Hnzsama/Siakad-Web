import { PageProps } from '@/types';
import { User } from '@/Pages/users/data/schema';
import { z } from 'zod';

export const violationTypeSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    points: z.number().int(),
    description: z.string().nullable().optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    selectedIds: z.array(z.string()).nullable().optional(),
});

export type ViolationType = z.infer<typeof violationTypeSchema>;

export interface ViolationTypeResponse extends PageProps {
    violationTypes: ViolationType[];
    auth: {
        user: User;
    };
}

export type FormData = Omit<ViolationType,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'selectedIds'
>;

export type Exportable = Omit<ViolationType,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'selectedIds'
>;
