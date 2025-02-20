import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Calendar, CalendarDays, GraduationCap, School, UserCircle } from 'lucide-react'
import { ClassroomShowResponse } from '../data/schema'
import { format } from 'date-fns'

interface HomeroomTeacherProps {
    teacher: ClassroomShowResponse['classroom']['homeroom_teacher']
    dialog?: boolean
}

export function HomeroomTeacher({ teacher, dialog = false }: HomeroomTeacherProps) {
    if (!teacher) return null;

    const teacherStats = [
        { label: "Pengalaman", value: "5 tahun", icon: <CalendarDays className="w-4 h-4" /> },
        { label: "Sertifikasi", value: teacher.certification ? "Ya" : "Tidak", icon: <School className="w-4 h-4" /> },
        { label: "Mengajar Sejak", value: format(new Date(teacher.created_at || new Date()), 'dd MMMM yyyy'), icon: <Calendar className="w-4 h-4" /> }
    ];

    if (dialog) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2">
                        <AvatarImage src="/placeholder-avatar.jpg" alt={teacher.name} />
                        <AvatarFallback className="text-xl">{teacher.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1.5">
                        <h2 className="text-xl font-semibold tracking-tight">{teacher.name}</h2>
                        <div className="space-y-0.5">
                            <p className="text-sm text-muted-foreground">{teacher.email}</p>
                            <p className="text-sm text-muted-foreground">{teacher.phone}</p>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="secondary">{teacher.position || 'Guru'}</Badge>
                            <Badge variant="outline">{teacher.subject || 'Umum'}</Badge>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Pengalaman</span>
                        </div>
                        <div className="text-sm font-medium">5 Tahun</div>
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <School className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Sertifikasi</span>
                        </div>
                        <div className="text-sm font-medium">{teacher.certification ? "Ya" : "Tidak"}</div>
                    </div>
                    <div className="col-span-2 space-y-1.5">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Mengajar Sejak</span>
                        </div>
                        <div className="text-sm font-medium">
                            {format(new Date(teacher.created_at || new Date()), 'dd MMMM yyyy')}
                        </div>
                    </div>
                </div>

                <Button className="w-full" variant="outline" size="sm">
                    <UserCircle className="w-4 h-4 mr-2" />
                    Lihat Profil Lengkap
                </Button>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden border rounded-lg group hover:bg-muted/50">
            <div className="p-4">
                <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12 border-2 ring-2 ring-background">
                        <AvatarImage src="/placeholder-avatar.jpg" alt={teacher.name} />
                        <AvatarFallback>{teacher.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate group-hover:text-primary">
                            {teacher.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <span className="truncate">{teacher.email}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                                {teacher.subject || "Umum"}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                                {teacher.certification ? "Bersertifikasi" : "Belum Sertifikasi"}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Pengalaman</span>
                        </div>
                        <div className="text-sm font-medium">5 Tahun</div>
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <School className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Status</span>
                        </div>
                        <div className="text-sm font-medium">Aktif</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
