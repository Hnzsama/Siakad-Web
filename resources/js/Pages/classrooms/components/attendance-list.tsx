import { Badge } from '@/components/ui/badge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Calendar, MapPin, MonitorSmartphone, Clock, User, UserSquare2 } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Attendance } from '@/Pages/attendances/data/schema'
import { Card, CardContent } from '@/components/ui/card'

interface AttendanceListProps {
    attendances: Attendance[]
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Present':
            return 'default'
        case 'Permission':
            return 'secondary'
        case 'Sick':
            return 'outline'
        default:
            return 'destructive'
    }
}

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'Present':
            return 'Hadir'
        case 'Permission':
            return 'Izin'
        case 'Sick':
            return 'Sakit'
        default:
            return 'Alpa'
    }
}

export function AttendanceList({ attendances }: AttendanceListProps) {
    if (attendances.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10">
                <Calendar className="w-12 h-12 mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Tidak ada absensi hari ini</h3>
                <p className="mt-1 text-sm text-muted-foreground">Belum ada data absensi yang tercatat.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {attendances.map((attendance) => (
                <Card key={attendance.id} className="overflow-hidden">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-muted-foreground" />
                                <span className="font-medium">
                                    {format(new Date(attendance.date), 'dd MMMM yyyy', { locale: id })}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <span>{attendance.attendable.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <UserSquare2 className="w-4 h-4 text-muted-foreground" />
                                    <span>{'nis' in attendance.attendable ? attendance.attendable.nis : attendance.attendable.nip}</span>
                                </div>
                            </div>

                            <Badge variant={getStatusColor(attendance.status)} className="w-fit">
                                {getStatusLabel(attendance.status)}
                            </Badge>

                            <div className="flex justify-between pt-2">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">Masuk: {attendance.check_in}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">Keluar: {attendance.check_out}</span>
                                </div>
                            </div>

                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <Badge variant="outline" className="justify-center w-full cursor-help">
                                        Detail Info
                                    </Badge>
                                </HoverCardTrigger>
                                <HoverCardContent align="center" className="w-80">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold">Detail Kehadiran</h4>
                                            <div className="space-y-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>Lokasi: {attendance.location_latitude}, {attendance.location_longitude}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MonitorSmartphone className="w-4 h-4" />
                                                    <span className="truncate">Device: {attendance.device_info}</span>
                                                </div>
                                                {attendance.notes && (
                                                    <div className="pt-2 mt-2 border-t">
                                                        <p className="text-sm">{attendance.notes}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {attendance.photo_path && (
                                            <img
                                                src={attendance.photo_path}
                                                alt="Attendance Photo"
                                                className="object-cover w-full h-32 rounded-md"
                                            />
                                        )}
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
