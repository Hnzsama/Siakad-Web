import { PageProps } from '@/types';
import { PaginatedResponse } from '@/types/app/paginate';
import { User } from '@/Pages/users/data/schema';
import { districtSchema, provinceSchema, regencySchema } from '@/types/prd';
import { z } from 'zod'

export const semesterSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    type: z.enum(['odd', 'even']),
    academic_year: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    description: z.string().nullable(),
    status: z.enum(['active', 'completed', 'pending']).default('active'),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    selectedIds: z.array(z.string()).nullable().optional(),
})

export type Semester = z.infer<typeof semesterSchema>

export interface SemestersResponse extends PageProps {
    semesters: Semester[];
    auth: {
        user: User;
    };
}

export type FormData = Omit<Semester,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'selectedIds'
>

export type Exportable = Omit<Semester,
    | 'id'
    | 'updated_at'
    | 'selectedIds'
>
