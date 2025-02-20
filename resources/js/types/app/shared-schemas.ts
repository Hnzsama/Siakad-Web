import { z } from 'zod';
import { baseTeacherSchema, baseUserSchema, baseSubjectTeacherSchema, baseClassSubjectSchema, baseStudentSchema, baseGuardianSchema, baseClassroomSchema } from '@/types/app/base-schemas';
import { shiftSchema } from '@/Pages/shifts/data/schema';
import { subjectSchema } from '@/Pages/subjects/data/schema';
import { classroomSchema } from '@/Pages/classrooms/data/schema';
import { semesterSchema } from '@/Pages/semesters/data/schema';

// Basic teacher schema without relations
export const basicTeacherSchema = baseTeacherSchema.extend({
    user: baseUserSchema,
    shift: shiftSchema,
});

export const basicStudentSchema = baseStudentSchema.extend({
    user: baseUserSchema,
    guardian: baseGuardianSchema,
    semester: semesterSchema,
    classroom: baseClassroomSchema,
});

// Basic subject teacher schema without full teacher relation
export const basicSubjectTeacherSchema = baseSubjectTeacherSchema.extend({
    subject: subjectSchema,
    // Only include necessary teacher fields
    teacher: basicTeacherSchema.omit({ shift: true }),
});

export const basicClassSubjectSchema = baseClassSubjectSchema.extend({
    classroom: classroomSchema.nullable().optional(),
    subject_teacher: basicSubjectTeacherSchema.nullable().optional(),
});
