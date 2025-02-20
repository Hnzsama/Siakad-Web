import { PageProps } from '@/types';
import { User } from '@/Pages/users/data/schema';
import { z } from 'zod';

export const leaveTypeSchema = z.object({
    id: z.string().uuid(),
    leave_name: z.string(),
    description: z.string().nullable().optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    selectedIds: z.array(z.string()).nullable().optional(),
});

export type LeaveType = z.infer<typeof leaveTypeSchema>;

export interface LeaveTypeResponse extends PageProps {
    leaveTypes: LeaveType[];
    auth: {
        user: User;
    };
}

export type FormData = Omit<LeaveType,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'selectedIds'
>;

export type Exportable = Omit<LeaveType,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'selectedIds'
>;
