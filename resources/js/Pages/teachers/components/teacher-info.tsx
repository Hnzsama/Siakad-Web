import { UserCircle, Mail, Phone, Calendar, GraduationCap, BookOpen, BriefcaseIcon, HomeIcon, Building2, MapPin, Cake, UserRound } from 'lucide-react';
import { Teacher } from '../data/schema';
import { InfoItem } from '@/Pages/classrooms/components/info-item';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/Pages/classrooms/components/stat-card';
import { Timeline } from '@/Pages/classrooms/components/timeline';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { hasRole } from '@/utils/permissions';

export default function TeacherInfo({ teacher, isAdmin = false }: { teacher: Teacher, isAdmin?: boolean }) {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Informasi {isAdmin ? 'Lengkap' : 'Dasar'}</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {!isAdmin ? (
                                <>
                                    <InfoItem
                                        icon={<UserCircle className="w-4 h-4" />}
                                        label="NIP"
                                        value={teacher.nip}
                                        badge
                                        variant="secondary"
                                    />
                                    <InfoItem
                                        icon={<BookOpen className="w-4 h-4" />}
                                        label="Mata Pelajaran"
                                        value={teacher.subject}
                                        badge
                                    />
                                    <InfoItem
                                        icon={<BriefcaseIcon className="w-4 h-4" />}
                                        label="Posisi"
                                        value={teacher.position}
                                    />
                                    <InfoItem
                                        icon={<Calendar className="w-4 h-4" />}
                                        label="Tahun Masuk"
                                        value={teacher.year_started}
                                        badge
                                        variant="secondary"
                                    />
                                    <InfoItem
                                        icon={<UserRound className="w-4 h-4" />}
                                        label="Jenis Kelamin"
                                        value={teacher.gender === 'Male' ? 'Laki-laki' : 'Perempuan'}
                                        badge
                                    />
                                    <InfoItem
                                        icon={<HomeIcon className="w-4 h-4" />}
                                        label="Alamat"
                                        value={teacher.address}
                                    />
                                </>
                            ) : (
                                <>
                                    <InfoItem
                                        icon={<UserCircle className="w-4 h-4" />}
                                        label="NIP"
                                        value={teacher.nip}
                                        badge
                                        variant="secondary"
                                    />
                                    <InfoItem
                                        icon={<MapPin className="w-4 h-4" />}
                                        label="Tempat Lahir"
                                        value={teacher.place_of_birth}
                                    />
                                    <InfoItem
                                        icon={<Cake className="w-4 h-4" />}
                                        label="Tanggal Lahir"
                                        value={format(new Date(teacher.date_of_birth), 'dd MMMM yyyy', { locale: id })}
                                    />
                                    <InfoItem
                                        icon={<GraduationCap className="w-4 h-4" />}
                                        label="Pendidikan"
                                        value={teacher.highest_education}
                                        badge
                                    />
                                    <InfoItem
                                        icon={<BookOpen className="w-4 h-4" />}
                                        label="Jurusan"
                                        value={teacher.major}
                                    />
                                    <InfoItem
                                        icon={<Building2 className="w-4 h-4" />}
                                        label="Universitas"
                                        value={teacher.university}
                                    />
                                    <InfoItem
                                        icon={<GraduationCap className="w-4 h-4" />}
                                        label="Sertifikasi"
                                        value={teacher.certification}
                                        badge
                                        variant="secondary"
                                    />
                                    <InfoItem
                                        icon={<BriefcaseIcon className="w-4 h-4" />}
                                        label="Posisi"
                                        value={teacher.position}
                                    />
                                    <InfoItem
                                        icon={<BookOpen className="w-4 h-4" />}
                                        label="Mata Pelajaran"
                                        value={teacher.subject}
                                        badge
                                    />
                                    <InfoItem
                                        icon={<Calendar className="w-4 h-4" />}
                                        label="Tahun Masuk"
                                        value={teacher.year_started}
                                        badge
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {isAdmin && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Pengalaman Kerja</h3>
                            <div className="p-4 border rounded-lg">
                                <p className="text-sm text-muted-foreground">{teacher.work_experience}</p>
                            </div>
                        </div>
                    )}

                    {hasRole('admin') && (
                        <>
                            {/* Statistics */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Statistik Kehadiran</h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <StatCard
                                        icon={<Calendar className="w-8 h-8 text-primary" />}
                                        label="Kehadiran Bulan Ini"
                                        value={
                                            <div className="flex items-center gap-2">
                                                <span>92%</span>
                                                <Badge variant="secondary">23/25 Hari</Badge>
                                            </div>
                                        }
                                    />
                                    <StatCard
                                        icon={<Calendar className="w-8 h-8 text-primary" />}
                                        label="Total Kehadiran"
                                        value={
                                            <Progress value={92} className="w-[120px]" />
                                        }
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Kontak</h3>
                        <div className="space-y-2">
                            <InfoItem
                                icon={<Mail className="w-4 h-4" />}
                                label="Email"
                                value={teacher.email}
                                badge
                                variant="secondary"
                            />
                            <InfoItem
                                icon={<Phone className="w-4 h-4" />}
                                label="Telepon"
                                value={teacher.phone || '-'}
                                badge
                            />
                        </div>

                        {/* Quick Actions */}
                        <div className="grid gap-2 pt-4">
                            {teacher.phone && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="justify-start w-full"
                                    onClick={() => window.location.href = `tel:${teacher.phone}`}
                                >
                                    <Phone className="w-4 h-4 mr-2" />
                                    Hubungi
                                </Button>
                            )}
                            {teacher.email && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="justify-start w-full"
                                    onClick={() => window.location.href = `mailto:${teacher.email}`}
                                >
                                    <Mail className="w-4 h-4 mr-2" />
                                    Kirim Email
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
