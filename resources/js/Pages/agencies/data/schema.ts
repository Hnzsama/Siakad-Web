import { studentSchema } from '@/Pages/students/data/schema';
import { teacherSchema } from '@/Pages/teachers/data/schema';
import { User } from '@/Pages/users/data/schema';
import { PageProps } from '@/types';
import { z } from 'zod';

export const agencySchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    address: z.string(),
    longitude: z.string(),
    latitude: z.string(),
    agencyable_id: z.string().uuid(),
    agencyable_type: z.string(),
    status: z.any(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    selectedIds: z.array(z.string()).nullable().optional(),
    agencyable: studentSchema.pick({ id: true, nis: true, name: true }).or(teacherSchema.pick({ id: true, nip: true, name: true }))
});

export type Agency = z.infer<typeof agencySchema>;

export interface AgencyResponse extends PageProps {
    agencies: Agency[];
    auth: {
        user: User;
    };
}

export interface AgencyShowResponse extends PageProps {
    agency?: Agency;
    agencies?: Agency[];
    auth: {
        user: User;
    };
}

export interface SelectResponse extends PageProps {
    students: z.infer<typeof studentSchema>[];
    teachers: z.infer<typeof teacherSchema>[];
}

export type FormData = Omit<Agency,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'selectedIds'
    | 'agencyable'
>;

export type Exportable = Omit<Agency,
    | 'id'
    | 'updated_at'
    | 'selectedIds'
>;
