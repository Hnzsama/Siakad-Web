import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Attendance } from '@/Pages/attendances/data/schema'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export function AttendanceHistory({ attendances }: { attendances: Attendance[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Riwayat Kehadiran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {attendances.map(attendance => (
                    <div key={attendance.id} className="grid gap-4 p-4 border rounded-lg sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Tanggal</p>
                            <p className="text-sm text-muted-foreground">
                                {format(new Date(attendance.date), 'dd MMMM yyyy', { locale: id })}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Check In</p>
                            <p className="text-sm text-muted-foreground">
                                {format(new Date(`2000-01-01 ${attendance.check_in}`), 'HH:mm')}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Check Out</p>
                            <p className="text-sm text-muted-foreground">
                                {format(new Date(`2000-01-01 ${attendance.check_out}`), 'HH:mm')}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Status</p>
                            <p className="text-sm text-muted-foreground">{attendance.status}</p>
                        </div>
                    </div>
                ))}
                {attendances.length === 0 && (
                    <div className="py-6 text-center text-muted-foreground">
                        Tidak ada riwayat kehadiran
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
