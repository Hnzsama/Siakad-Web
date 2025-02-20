import { z } from 'zod'

// Province Schema
export const provinceSchema = z.object({
    id: z.number(),
    code: z.number(),
    name: z.string(),
    created_at: z.string().datetime().nullable(),
    updated_at: z.string().datetime().nullable(),
})

// Regency Schema
export const regencySchema = z.object({
    id: z.number(),
    province_code: z.number(),
    code: z.number(),
    name: z.string(),
    created_at: z.string().datetime().nullable(),
    updated_at: z.string().datetime().nullable(),
})

// District Schema
export const districtSchema = z.object({
    id: z.number(),
    regency_code: z.number(),
    code: z.number(),
    name: z.string(),
    created_at: z.string().datetime().nullable(),
    updated_at: z.string().datetime().nullable(),
})

// Type definitions
export type Province = z.infer<typeof provinceSchema>
export type Regency = z.infer<typeof regencySchema>
export type District = z.infer<typeof districtSchema>

// Form Data Types (if needed)
export type ProvinceFormData = Pick<Province, 'code' | 'name'>
export type RegencyFormData = Pick<Regency, 'province_code' | 'code' | 'name'>
export type DistrictFormData = Pick<District, 'regency_code' | 'code' | 'name'>