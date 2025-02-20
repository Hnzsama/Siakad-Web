import { PageProps } from '@/types';
import { PaginatedResponse } from '@/types/app/paginate';
import { User } from '@/Pages/users/data/schema';
import { z } from 'zod'

export const roleSchema = z.object({
    id: z.number(),
    name: z.string(),
    guard_name: z.string(),
    permission_count: z.number(),
    permissions: z.record(z.string(), z.boolean()).nullable(),
    updated_at: z.string().nullable(),
    selectedIds: z.array(z.number()).nullable().optional(),
})

export type Role = z.infer<typeof roleSchema>

export interface RolesResponse extends PageProps {
    roles: Role[];
    modelPermissions: Record<string, string[]>;
    maxPermission: number;
    auth: {
        user: User;
    };
}

export type RoleFormData = Omit<Pick<Role,
    | 'name'
    | 'guard_name'
    | 'permissions'>,
    |'permissions'> & {
        permissions: Record<string, boolean>;
    };

