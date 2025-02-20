import { PageProps } from '@/types';
import { PaginatedResponse } from '@/types/app/paginate';
import { User } from '@/Pages/users/data/schema';
import { districtSchema, provinceSchema, regencySchema } from '@/types/prd';
import { z } from 'zod'

export const schoolSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    npsn: z.string(),
    schoolLevel: z.string(),

    address: z.string(),
    province_code: z.number(),
    regency_code: z.number(),
    district_code: z.number(),
    postal_code: z.string(),
    phone: z.string().nullable(),
    email: z.string().email().nullable(),
    website: z.string().url().nullable(),

    province: provinceSchema,
    regency: regencySchema,
    district: districtSchema,

    accreditation: z.string().nullable(),
    accreditation_year: z.string().or(z.number()).nullable(),
    headmaster: z.string().nullable(),
    teacher_count: z.number().nullable(),
    student_count: z.number().nullable(),
    ownership: z.string().nullable(),
    establishment_year: z.string().or(z.number()).nullable(),
    curriculum: z.string().nullable(),
    logo: z.string().nullable(),
    status: z.any(),

    created_at: z.string().datetime().nullable(),
    updated_at: z.string().datetime().nullable(),

    selectedIds: z.array(z.string()).nullable().optional(),
})

export type School = z.infer<typeof schoolSchema>

export interface SchoolsResponse extends PageProps {
    schools: School[];
    auth: {
        user: User;
    };
}

export interface RegionalResponse extends PageProps {
    provinces: {
        name: string,
        code: number,
    }[]
    regencies: {
        name: string,
        code: number,
        province_code: number
    }[]
    districts: {
        name: string,
        code: number,
        regency_code: number
    }[]
}

export type FormData = Pick<School,
    | 'name'
    | 'npsn'
    | 'schoolLevel'
    | 'address'
    | 'province_code'
    | 'regency_code'
    | 'district_code'
    | 'postal_code'
    | 'status'
>

export type FormProfile = Omit<School,
    | 'id'
    | 'province'
    | 'regency'
    | 'district'
    | 'created_at'
    | 'updated_at'
    | 'selectedIds'
>

export type Exportable = {
    name: string
    npsn: string
    schoolLevel: string
    address: string
    province: string
    regency: string
    district: string
    postal_code: string
    status: boolean
}
