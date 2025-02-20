import { PageProps } from '@/types';
import { User } from '@/Pages/users/data/schema';
import { z } from 'zod';

export const shiftSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    status: z.any(),
    class_duration: z.number().nullable().optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    selectedIds: z.array(z.string()).nullable().optional(),
    schedules: z.object({
        id: z.string().uuid(),
        shift_id: z.string().uuid(),
        day: z.string(),
        start_time: z.string(),
        end_time: z.string(),
        entry_grace_period: z.string(),
        exit_grace_period: z.string(),
        status: z.any(),
        created_at: z.string().datetime(),
        updated_at: z.string().datetime(),
    }).array().optional(),
});

export type Shift = z.infer<typeof shiftSchema>;

export interface ShiftResponse extends PageProps {
    shifts: Shift[];
    auth: {
        user: User;
    };
}

export type FormData = Omit<Shift,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'selectedIds'
    | 'schedule'
>

export type Exportable = Omit<Shift,
    | 'id'
    | 'updated_at'
    | 'selectedIds'
>
