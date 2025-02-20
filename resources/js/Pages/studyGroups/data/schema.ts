import { PageProps } from '@/types';
import { User } from '@/Pages/users/data/schema';
import { z } from 'zod';

export const studyGroupSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    selectedIds: z.array(z.string()).nullable().optional(),
});

export type StudyGroup = z.infer<typeof studyGroupSchema>;

export interface StudyGroupResponse extends PageProps {
    studyGroups: StudyGroup[];
    auth: {
        user: User;
    };
}

export type FormData = Omit<StudyGroup,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'selectedIds'
>

export type Exportable = Omit<StudyGroup,
    | 'id'
    | 'updated_at'
    | 'selectedIds'
>
