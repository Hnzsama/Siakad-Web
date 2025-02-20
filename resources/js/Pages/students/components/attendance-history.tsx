import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Attendance } from '@/Pages/attendances/data/schema'
import { Badge } from '@/components/ui/badge'

export function AttendanceHistory({ attendances }: { attendances: Attendance[] }) {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold">Riwayat Kehadiran</h3>
            <div className="space-y-4">
                {attendances?.map(attendance => (
                    <div key={attendance.id} className="p-4 space-y-4 border rounded-lg">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Tanggal</p>
                            <p className="text-sm text-muted-foreground">
                                {format(new Date(attendance.date), 'dd MMMM yyyy', { locale: id })}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Check In</p>
                            <p className="text-sm text-muted-foreground">
                                {attendance.check_in ? format(new Date(`2000-01-01 ${attendance.check_in}`), 'HH:mm') : '-'}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Check Out</p>
                            <p className="text-sm text-muted-foreground">
                                {attendance.check_out ? format(new Date(`2000-01-01 ${attendance.check_out}`), 'HH:mm') : '-'}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Status</p>
                            <Badge variant={
                                attendance.status === 'Present' ? 'default' :
                                    attendance.status === 'Late' ? 'outline' :
                                        attendance.status === 'Absent' ? 'destructive' :
                                            'secondary'
                            }>
                                {attendance.status === 'Present' ? 'Hadir' :
                                    attendance.status === 'Late' ? 'Terlambat' :
                                        attendance.status === 'Absent' ? 'Tidak Hadir' :
                                            attendance.status}
                            </Badge>
                        </div>
                        {attendance.notes && (
                            <div className="space-y-1 sm:col-span-2 lg:col-span-4">
                                <p className="text-sm font-medium">Catatan</p>
                                <p className="text-sm text-muted-foreground">{attendance.notes}</p>
                            </div>
                        )}
                    </div>
                ))}
                {(!attendances || attendances.length === 0) && (
                    <div className="py-6 text-center text-muted-foreground">
                        Tidak ada riwayat kehadiran
                    </div>
                )}
            </div>
        </div>
    )
}
