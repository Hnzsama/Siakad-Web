import { Shift, shiftSchema } from '@/Pages/shifts/data/schema';
import { PageProps } from '@/types';
import { User } from '@/Pages/users/data/schema';
import { z } from 'zod';

export const attendanceSettingSchema = z.object({
    id: z.string().uuid(),
    allow_location_based: z.any(),
    allowed_radius: z.number().nullable(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export type AttendanceSetting = z.infer<typeof attendanceSettingSchema>;

export interface AttendanceSettingResponse extends PageProps {
    attendanceSetting: AttendanceSetting;
    auth: {
        user: User;
    };
}

export type FormData = Omit<AttendanceSetting,
    | 'id'
    | 'created_at'
    | 'updated_at'
>
