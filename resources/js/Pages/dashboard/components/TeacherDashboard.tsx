import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { IconUsers, IconUserCheck } from '@tabler/icons-react'
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TeacherDashboardProps {
    studentsPerClass: any[];
    isHomeroom: boolean;
}

export function TeacherDashboard({ studentsPerClass, isHomeroom }: TeacherDashboardProps) {
    return (
        <>
            <div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                        <CardTitle className='text-sm font-medium'>Status Wali Kelas</CardTitle>
                        <IconUsers className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {isHomeroom ? 'Ya' : 'Tidak'}
                        </div>
                        <p className='text-xs text-muted-foreground'>
                            {isHomeroom ? 'Anda adalah wali kelas' : 'Anda bukan wali kelas'}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                        <CardTitle className='text-sm font-medium'>Total Siswa</CardTitle>
                        <IconUserCheck className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            {isHomeroom ? studentsPerClass.reduce((acc, curr) => acc + curr.total, 0) : 0}
                        </div>
                        <p className='text-xs text-muted-foreground'>Siswa yang diwalikan</p>
                    </CardContent>
                </Card>
            </div>
            {isHomeroom && (
                <div className='grid grid-cols-1 gap-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Kelas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[300px]">
                                <div className="space-y-4">
                                    {studentsPerClass.map((classroom) => (
                                        <div key={classroom.id} className="flex items-center justify-between p-2 border rounded">
                                            <span>{classroom.name}</span>
                                            <Badge variant="secondary">{classroom.total} siswa</Badge>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    )
}
