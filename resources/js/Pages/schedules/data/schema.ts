import { Shift, shiftSchema } from '@/Pages/shifts/data/schema';
import { User } from '@/Pages/users/data/schema';
import { PageProps } from '@/types';
import { z } from 'zod';

export const scheduleSchema = z.object({
    id: z.string().uuid(),
    shift_id: z.string().uuid(),
    day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).or(z.string()),
    start_time: z.string(),
    end_time: z.string(),
    entry_grace_period: z.string().nullable().optional(),
    exit_grace_period: z.string().nullable().optional(),
    status: z.any(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    selectedIds: z.array(z.string()).nullable().optional(),
    shift: shiftSchema
});

export type Schedule = z.infer<typeof scheduleSchema>;

export interface ScheduleResponse extends PageProps {
    schedules: Schedule[];
    auth: {
        user: User;
    };
}

export interface FilterResponse extends ScheduleResponse {
    shifts: z.infer<typeof shiftSchema>[]
}

export interface SelectResponse extends ScheduleResponse {
    shifts: z.infer<typeof shiftSchema>[]
}

export type FormData = Omit<Schedule,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'selectedIds'
    | 'shift'
>

export type Exportable = {
    shift_id: string;
    day: string;
    start_time: string;
    end_time: string;
    entry_grace_period: string | null | undefined;
    exit_grace_period: string | null | undefined;
    status: string;
    created_at: string;
}
