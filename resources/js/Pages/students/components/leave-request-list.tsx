import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { BasicLeaveRequest } from '@/Pages/leaveRequests/data/schema'

export function LeaveRequestList({ leaveRequests }: { leaveRequests: BasicLeaveRequest[] }) {
    const getBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'default'
            case 'pending':
                return 'outline'
            case 'rejected':
                return 'destructive'
            default:
                return 'secondary'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'Disetujui'
            case 'pending':
                return 'Menunggu'
            case 'rejected':
                return 'Ditolak'
            default:
                return status
        }
    }

    return (
        <div className="space-y-4">
            <h3 className="font-semibold">Riwayat Izin</h3>
            <div className="space-y-4">
                {leaveRequests?.map(leave => (
                    <div key={leave.id} className="p-4 space-y-4 border rounded-lg">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Tanggal Mulai</p>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(leave.start_date), 'dd MMMM yyyy', { locale: id })}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Tanggal Selesai</p>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(leave.end_date), 'dd MMMM yyyy', { locale: id })}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Status</p>
                                <Badge variant={getBadgeVariant(leave.status)}>
                                    {getStatusLabel(leave.status)}
                                </Badge>
                            </div>
                            {leave.leave_type_id && (
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Jenis Izin</p>
                                    <p className="text-sm text-muted-foreground">
                                        {leave.leave_type_id}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Alasan</p>
                            <p className="text-sm text-muted-foreground">{leave.reason}</p>
                        </div>
                        {leave.attachment_url && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Lampiran</p>
                                <a
                                    href={leave.attachment_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Lihat Lampiran
                                </a>
                            </div>
                        )}
                    </div>
                ))}
                {(!leaveRequests || leaveRequests.length === 0) && (
                    <div className="py-6 text-center text-muted-foreground">
                        Tidak ada riwayat izin
                    </div>
                )}
            </div>
        </div>
    )
}
