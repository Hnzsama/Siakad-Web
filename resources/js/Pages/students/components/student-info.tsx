import { UserCircle, Mail, Phone, Calendar, MapPin, Home, BookOpen, School, Cake, UserRound } from 'lucide-react';
import { InfoItem } from './info-item';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/Pages/classrooms/components/stat-card';
import { Timeline } from '@/Pages/classrooms/components/timeline';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Student } from '../data/schema';

interface StudentInfoProps {
    student?: Student;
    isAdmin?: boolean;
}

export function StudentInfo({ student, isAdmin = false }: StudentInfoProps) {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Informasi {isAdmin ? 'Lengkap' : 'Dasar'}</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InfoItem
                                icon={<UserCircle className="w-4 h-4" />}
                                label="NIS"
                                value={student?.nis}
                                badge
                                variant="secondary"
                            />
                            <InfoItem
                                icon={<UserRound className="w-4 h-4" />}
                                label="Jenis Kelamin"
                                value={student?.gender === 'Male' ? 'Laki-laki' : 'Perempuan'}
                                badge
                            />
                            <InfoItem
                                icon={<School className="w-4 h-4" />}
                                label="Kelas"
                                value={student?.classroom?.name || '-'}
                            />
                            <InfoItem
                                icon={<Calendar className="w-4 h-4" />}
                                label="Tanggal Masuk"
                                value={student?.enrollment_date ? format(new Date(student.enrollment_date), 'dd MMMM yyyy', { locale: id }) : '-'}
                                badge
                            />
                            <InfoItem
                                icon={<MapPin className="w-4 h-4" />}
                                label="Tempat Lahir"
                                value={student?.place_of_birth}
                            />
                            <InfoItem
                                icon={<Cake className="w-4 h-4" />}
                                label="Tanggal Lahir"
                                value={student?.date_of_birth ? format(new Date(student.date_of_birth), 'dd MMMM yyyy', { locale: id }) : '-'}
                            />
                            <InfoItem
                                icon={<Home className="w-4 h-4" />}
                                label="Alamat"
                                value={student?.address}
                            />
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Statistik</h3>
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
                                icon={<BookOpen className="w-8 h-8 text-primary" />}
                                label="Poin Pelanggaran"
                                value={
                                    <div className="flex items-center gap-2">
                                        <span>{student?.violation_points}</span>
                                        <Badge variant="secondary">Poin</Badge>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Kontak</h3>
                        <div className="space-y-2">
                            <InfoItem
                                icon={<Mail className="w-4 h-4" />}
                                label="Email"
                                value={student?.email}
                                badge
                                variant="secondary"
                            />
                            <InfoItem
                                icon={<Phone className="w-4 h-4" />}
                                label="Telepon"
                                value={student?.phone}
                                badge
                            />
                        </div>

                        {/* Guardian Info if available */}
                        {student?.guardian && (
                            <>
                                <h4 className="text-sm font-semibold">Wali Murid</h4>
                                <div className="space-y-2">
                                    <InfoItem
                                        icon={<UserCircle className="w-4 h-4" />}
                                        label="Nama"
                                        value={student?.guardian.name}
                                    />
                                    <InfoItem
                                        icon={<Phone className="w-4 h-4" />}
                                        label="Telepon"
                                        value={student?.guardian.phone}
                                        badge
                                    />
                                </div>
                            </>
                        )}

                        {/* Quick Actions */}
                        <div className="grid gap-2 pt-4">
                            {student?.phone && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="justify-start w-full"
                                    onClick={() => window.location.href = `tel:${student?.phone}`}
                                >
                                    <Phone className="w-4 h-4 mr-2" />
                                    Hubungi Siswa
                                </Button>
                            )}
                            {student?.guardian?.phone && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="justify-start w-full"
                                    onClick={() => window.location.href = `tel:${student?.guardian?.phone}`}
                                >
                                    <Phone className="w-4 h-4 mr-2" />
                                    Hubungi Wali
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
