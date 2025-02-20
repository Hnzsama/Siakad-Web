import { format } from "date-fns"
import { id } from "date-fns/locale"

export function LeaveRequestDetails({ leaveRequest }: { leaveRequest: any }) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <h3 className="text-sm font-medium">Alasan Izin</h3>
                <p className="text-sm">{leaveRequest.reason}</p>
            </div>

            {leaveRequest.attachment_url && (
                <div className="space-y-2">
                    <h3 className="text-sm font-medium">Lampiran</h3>
                    <a
                        href={leaveRequest.attachment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Lihat Lampiran
                    </a>
                </div>
            )}

            {leaveRequest.rejection_reason && (
                <div className="space-y-2">
                    <h3 className="text-sm font-medium">Alasan Penolakan</h3>
                    <p className="text-sm text-red-600">{leaveRequest.rejection_reason}</p>
                </div>
            )}

            {leaveRequest.approver && (
                <div className="space-y-2">
                    <h3 className="text-sm font-medium">Disetujui Oleh</h3>
                    <p className="text-sm">{leaveRequest.approver.name}</p>
                </div>
            )}
        </div>
    )
}
