import { attendanceSchema } from '@/Pages/attendances/data/schema';
import { classroomSchema } from '@/Pages/classrooms/data/schema';
import { guardianSchema } from '@/Pages/guardians/data/schema';
import { semesterSchema } from '@/Pages/semesters/data/schema';
import { User, userSchema } from '@/Pages/users/data/schema';
import { PageProps } from '@/types';
import { baseClassroomSchema, baseGuardianSchema, baseLeaveRequestSchema, baseStudentSchema, baseUserSchema, baseViolationSchema, baseWarningLetterSchema } from '@/types/app/base-schemas';
import { z } from 'zod';

export const basicStudentSchema = baseStudentSchema.extend({
    user: baseUserSchema,
    guardian: baseGuardianSchema.nullable().optional(),
    semester: semesterSchema,
    classroom: baseClassroomSchema.nullable().optional(),
});

export const studentSchema = basicStudentSchema.extend({
    warning_letters: z.array(baseWarningLetterSchema).nullable().optional(),
    leave_requests: z.array(baseLeaveRequestSchema).nullable().optional(),
    violations: z.array(baseViolationSchema).nullable().optional(),
    attendances: z.array(attendanceSchema).nullable().optional(),
});

export type Student = z.infer<typeof studentSchema>;

export interface StudentResponse extends PageProps {
    students: Student[];
    auth: {
        user: User;
    };
}

export interface StudentShowResponse extends PageProps {
    student?: Student;
    students?: Student[];
    auth: {
        user: User;
    };
}

export interface FilterResponse extends StudentResponse {
    classrooms: z.infer<typeof classroomSchema>[];
}

export interface SelectResponse extends StudentResponse {
    classrooms: z.infer<typeof classroomSchema>[];
    semesters: z.infer<typeof semesterSchema>[];
    guardians: z.infer<typeof guardianSchema>[];
}

export type FormData = Omit<Student,
    | 'id'
    | 'user_id'
    | 'created_at'
    | 'updated_at'
    | 'deleted_at'
    | 'selectedIds'
    | 'user'
    | 'guardian'
    | 'semester'
    | 'classroom'
>;

export type FormProfile = Pick<Student,
    | 'name'
    | 'nik'
    | 'gender'
    | 'place_of_birth'
    | 'date_of_birth'
    | 'address'
    | 'phone'
    | 'email'
    | 'status'
>

export type Exportable = Omit<Student,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'deleted_at'
    | 'selectedIds'
>;
