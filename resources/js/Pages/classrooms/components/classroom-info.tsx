import { School, Users, GraduationCap, CalendarDays, UserCircle, CalendarCheck, BookOpen, CalendarRange, ClipboardList, Bell } from 'lucide-react';
import { ClassroomShowResponse } from '../data/schema';
import { InfoItem } from './info-item';
import { HomeroomTeacher } from './homeroom-teacher';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { StatCard } from './stat-card';
import { Timeline } from './timeline';

interface ClassroomInfoProps {
    classroom: ClassroomShowResponse['classroom'];
    teacher: ClassroomShowResponse['classroom']['homeroom_teacher'];
    average: number;
    percentage: {
        percentage: number;
        total: number;
        present: number;
    }
}

export function ClassroomInfo({ classroom, teacher, average, percentage }: ClassroomInfoProps) {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {/* Informasi Dasar */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Informasi Kelas</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InfoItem
                                icon={<School className="w-4 h-4" />}
                                label="Tingkat Kelas"
                                value={`${classroom.class_level.alphabet}-${classroom.class_level.level}`}
                                badge
                                variant="secondary"
                            />
                            <InfoItem
                                icon={<Users className="w-4 h-4" />}
                                label="Rombongan Belajar"
                                value={classroom.study_group.name}
                                badge
                                variant="default"
                            />
                            {classroom.major && (
                                <InfoItem
                                    icon={<GraduationCap className="w-4 h-4" />}
                                    label="Jurusan"
                                    value={classroom.major.name}
                                    badge
                                    variant="secondary"
                                />
                            )}
                            <InfoItem
                                icon={<CalendarDays className="w-4 h-4" />}
                                label="Shift Pembelajaran"
                                value={classroom.shift?.name || "Belum ditentukan"}
                                badge
                                variant="default"
                            />
                        </div>
                    </div>

                    {/* Statistik Kelas */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Statistik Absensi</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <StatCard
                                icon={<Users className="w-8 h-8 text-primary" />}
                                label="Kehadiran Hari Ini"
                                value={
                                    <div className="flex items-center gap-2">
                                        <span>{percentage.percentage ?? 0}%</span>
                                        <Badge variant="secondary">{percentage.present ?? 0}/{percentage.total ?? 0} Siswa</Badge>
                                    </div>
                                }
                            />
                            <StatCard
                                icon={<CalendarCheck className="w-8 h-8 text-primary" />}
                                label="Rata-rata Kehadiran"
                                value={
                                    <Progress value={average} className="w-[120px]" />
                                }
                            />
                        </div>
                    </div>

                    {/* Pengumuman Section */}
                    {/* <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Pengumuman Kelas</h3>
                        <div className="p-4 border rounded-lg">
                            <div className="text-sm text-muted-foreground">
                                Tidak ada pengumuman
                            </div>
                        </div>
                    </div> */}
                </div>

                <div className="space-y-6">
                    {/* Wali Kelas Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Wali Kelas</h3>
                        {teacher ? (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <div className="cursor-pointer">
                                        <HomeroomTeacher teacher={teacher} />
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    <HomeroomTeacher teacher={teacher} dialog />
                                </DialogContent>
                            </Dialog>
                        ) : (
                            <p className="text-sm text-muted-foreground">Belum ditentukan</p>
                        )}
                    </div>

                    {/* Quick Actions */}
                    {/* <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Aksi Cepat</h3>
                        <div className="grid gap-2">
                            <Button variant="outline" className="justify-start">
                                <CalendarRange className="w-4 h-4 mr-2" />
                                Lihat Jadwal
                            </Button>
                            <Button variant="outline" className="justify-start">
                                <ClipboardList className="w-4 h-4 mr-2" />
                                Absensi Kelas
                            </Button>
                            <Button variant="outline" className="justify-start">
                                <Bell className="w-4 h-4 mr-2" />
                                Buat Pengumuman
                            </Button>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}
