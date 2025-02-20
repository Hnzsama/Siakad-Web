import { Teacher } from '../data/schema'
import { School, Users, GraduationCap, CalendarDays } from 'lucide-react'
import { StatCard } from '@/Pages/classrooms/components/stat-card'
import { Timeline } from '@/Pages/classrooms/components/timeline'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { hasRole } from '@/utils/permissions'

export function ClassroomInfo({ teacher, isAdmin = false }: { teacher: Teacher, isAdmin?: boolean }) {
    if (!teacher.homeroom_teacher && !isAdmin) return null;

    return (
        <div className="space-y-8">
            {/* Basic Info */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informasi Kelas Wali</h3>
                {teacher.homeroom_teacher ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Kelas</p>
                            <p className="text-sm text-muted-foreground">{teacher.homeroom_teacher.name}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Ruangan</p>
                            <p className="text-sm text-muted-foreground">{teacher.homeroom_teacher.room_number}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Tingkat</p>
                            <p className="text-sm text-muted-foreground">{teacher.homeroom_teacher.class_level?.alphabet}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Jurusan</p>
                            <p className="text-sm text-muted-foreground">{teacher.homeroom_teacher.major?.name}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Rombel</p>
                            <p className="text-sm text-muted-foreground">{teacher.homeroom_teacher.study_group?.name}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Shift</p>
                            <p className="text-sm text-muted-foreground">
                                {teacher.homeroom_teacher.shift?.name || '-'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 text-sm border rounded-lg text-muted-foreground">
                        Guru ini bukan merupakan wali kelas
                    </div>
                )}
            </div>

            {teacher.homeroom_teacher && hasRole('admin') && (
                <>
                    {/* Stats */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Statistik Kelas</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <StatCard
                                icon={<Users className="w-8 h-8 text-primary" />}
                                label="Kehadiran Hari Ini"
                                value={
                                    <div className="flex items-center gap-2">
                                        <span>95%</span>
                                        <Badge variant="secondary">38/40 Siswa</Badge>
                                    </div>
                                }
                            />
                            <StatCard
                                icon={<School className="w-8 h-8 text-primary" />}
                                label="Rata-rata Kehadiran"
                                value={
                                    <Progress value={92} className="w-[120px]" />
                                }
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
