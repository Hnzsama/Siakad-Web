import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { IconUsers, IconUserCheck, IconUsersGroup, IconUserShield } from '@tabler/icons-react'
import { Overview } from './overview'
import { TopViolators } from './top-violators'

interface AdminDashboardProps {
    totalStudents?: number;
    totalTeachers?: number;
    totalGuardians?: number;
    totalUsers?: number;
}

export function AdminDashboard({ 
    totalStudents, 
    totalTeachers, 
    totalGuardians, 
    totalUsers 
}: AdminDashboardProps) {
    return (
        <>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                        <CardTitle className='text-sm font-medium'>
                            Total Siswa
                        </CardTitle>
                        <IconUsers className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{totalStudents}</div>
                        <p className='text-xs text-muted-foreground'>
                            Siswa terdaftar
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                        <CardTitle className='text-sm font-medium'>
                            Total Guru
                        </CardTitle>
                        <IconUserCheck className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{totalTeachers}</div>
                        <p className='text-xs text-muted-foreground'>
                            Guru aktif
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                        <CardTitle className='text-sm font-medium'>
                            Total Wali
                        </CardTitle>
                        <IconUsersGroup className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{totalGuardians}</div>
                        <p className='text-xs text-muted-foreground'>
                            Wali murid
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                        <CardTitle className='text-sm font-medium'>
                            Total Pengguna
                        </CardTitle>
                        <IconUserShield className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{totalUsers}</div>
                        <p className='text-xs text-muted-foreground'>
                            Pengguna sistem
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
                <Card className='col-span-1 lg:col-span-4'>
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className='pl-2'>
                        <Overview />
                    </CardContent>
                </Card>
                <Card className='col-span-1 lg:col-span-3'>
                    <CardHeader>
                        <CardTitle>Siswa Bermasalah</CardTitle>
                        <CardDescription>
                            5 siswa dengan poin pelanggaran terbanyak
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TopViolators />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
