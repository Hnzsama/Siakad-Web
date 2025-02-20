import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User } from '@/Pages/users/data/schema';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react'

interface Violator {
    id: string;
    name: string;
    nis: string;
    classroom: string;
    remaining_points: number;
    deducted_points: number;
}

interface Response extends PageProps {
    topViolators: Violator[];
    auth: {
        user: User;
    }
}

export function TopViolators() {
    const { topViolators } = usePage<Response>().props

    return (
        <div className='space-y-8'>
            {topViolators.map((student) => (
                <div key={student.id} className='flex items-center gap-4'>
                    <Avatar className='h-9 w-9'>
                        <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-wrap items-center justify-between flex-1'>
                        <div className='space-y-1'>
                            <p className='text-sm font-medium leading-none'>{student.name}</p>
                            <div className='flex items-center gap-2'>
                                <p className='text-sm text-muted-foreground'>{student.nis}</p>
                                <span className='text-sm text-muted-foreground'>•</span>
                                <p className='text-sm text-muted-foreground'>{student.classroom}</p>
                            </div>
                        </div>
                        <div className='text-sm font-medium text-destructive'>
                            {student.deducted_points} poin
                        </div>
                    </div>
                </div>
            ))}

            {topViolators.length === 0 && (
                <div className='py-4 text-sm text-center text-muted-foreground'>
                    Tidak ada data pelanggaran
                </div>
            )}
        </div>
    )
}
