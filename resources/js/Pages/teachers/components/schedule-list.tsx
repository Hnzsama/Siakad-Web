import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClassSubject } from '@/Pages/classSubjects/data/schema'
import { format } from 'date-fns'
import { Clock, BookOpen, Building2, Calendar } from 'lucide-react'
import InfoItem from '@/components/info-item'

export function ScheduleList({ schedules }: { schedules: ClassSubject[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Jadwal Mengajar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {schedules.map(schedule => (
                    <div key={schedule.id} className="grid gap-4 p-4 border rounded-lg sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Mata Pelajaran</p>
                            <p className="text-sm text-muted-foreground">{schedule.name}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Hari</p>
                            <p className="text-sm text-muted-foreground">{schedule.day}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Waktu</p>
                            <p className="text-sm text-muted-foreground">
                                {format(new Date(`2000-01-01 ${schedule.start_time}`), 'HH:mm')} -
                                {format(new Date(`2000-01-01 ${schedule.end_time}`), 'HH:mm')}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Kelas</p>
                            <p className="text-sm text-muted-foreground">{schedule.classroom?.room_number || '-'}</p>
                        </div>
                    </div>
                ))}
                {schedules.length === 0 && (
                    <div className="py-6 text-center text-muted-foreground">
                        Tidak ada jadwal yang tersedia
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
