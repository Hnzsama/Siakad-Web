import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertTriangle,
    Calendar,
    User,
    FileText,
    Clock,
    Calendar as CalendarIcon,
    AlertCircle,
    CheckCircle2,
    XCircle,
    School
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Violation } from '../data/schema'
import { Card } from '@/components/ui/card'

interface ViolationDialogProps {
    violation: Violation
    trigger?: React.ReactNode
}

export function ViolationDialog({ violation, trigger }: ViolationDialogProps) {
    const getStatusBadge = () => {
        switch (violation.status) {
            case 'approved':
                return <Badge variant="default">Disetujui</Badge>
            case 'cancelled':
                return <Badge variant="destructive">Dibatalkan</Badge>
            default:
                return <Badge variant="secondary">Menunggu</Badge>
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || <button className="w-full h-full">Open Detail</button>}
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Detail Pelanggaran</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Header Info */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <div className="p-2 mt-1 bg-orange-100 rounded-lg dark:bg-orange-900/20">
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium">{violation.violation_type.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(violation.violation_date), 'EEEE, dd MMMM yyyy', { locale: id })}
                                </p>
                            </div>
                        </div>
                        <Badge
                            variant="destructive"
                            className="px-3 h-7"
                        >
                            -{violation.violation_type.points} poin
                        </Badge>
                    </div>

                    {/* Student Info */}
                    <Card className="p-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{violation.student.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <School className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">NIS: {violation.student.nis}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Violation Details */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Status</h4>
                            <div className="flex items-center gap-2">
                                {getStatusBadge()}
                                {violation.status === 'approved' && violation.approver && (
                                    <span className="text-sm text-muted-foreground">
                                        oleh {violation.approver.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        {violation.description && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium">Deskripsi</h4>
                                <p className="text-sm text-muted-foreground">{violation.description}</p>
                            </div>
                        )}

                        {/* Sanction Details if available */}
                        {violation.sanction_notes && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium">Sanksi</h4>
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">{violation.sanction_notes}</p>
                                    {violation.sanction_start_date && violation.sanction_end_date && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <CalendarIcon className="w-4 h-4" />
                                            <span>
                                                {format(new Date(violation.sanction_start_date), 'dd MMM yyyy', { locale: id })}
                                                {' - '}
                                                {format(new Date(violation.sanction_end_date), 'dd MMM yyyy', { locale: id })}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Created/Updated Info */}
                        <div className="pt-4 mt-4 space-y-2 text-sm border-t text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>
                                    Dibuat oleh {violation.creator.name} pada {' '}
                                    {format(new Date(violation.created_at), 'dd MMM yyyy HH:mm', { locale: id })}
                                </span>
                            </div>
                            {violation.updater && (
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>
                                        Diperbarui oleh {violation.updater.name} pada {' '}
                                        {format(new Date(violation.updated_at), 'dd MMM yyyy HH:mm', { locale: id })}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
