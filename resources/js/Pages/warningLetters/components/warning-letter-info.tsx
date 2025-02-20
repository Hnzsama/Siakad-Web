import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { FileWarning, User, Calendar, FileText, MessageCircle, CheckCircle2, XCircle } from 'lucide-react'

export function WarningLetterInfo({ warningLetter }: { warningLetter: any }) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex-row items-center justify-between space-y-0">
                    <CardTitle className="flex items-center gap-2">
                        <FileWarning className="w-5 h-5 text-primary" />
                        Surat Peringatan {warningLetter.letter_number}
                    </CardTitle>
                    <Badge variant={
                        warningLetter.status === 'approved' ? 'default' :
                        warningLetter.status === 'cancelled' ? 'destructive' : 'outline'
                    }>
                        {warningLetter.status === 'approved' ? 'Disetujui' :
                         warningLetter.status === 'cancelled' ? 'Dibatalkan' : 'Menunggu'}
                    </Badge>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <InfoItem
                            icon={User}
                            label="Siswa"
                            value={`${warningLetter.student.name} (${warningLetter.student.nis})`}
                        />
                        <InfoItem
                            icon={Calendar}
                            label="Tanggal"
                            value={format(new Date(warningLetter.issued_date), 'dd MMMM yyyy', { locale: id })}
                        />
                        <InfoItem
                            icon={FileText}
                            label="Kategori"
                            value={`${warningLetter.warning_category.category_name} (Level ${warningLetter.warning_category.level})`}
                        />
                        <InfoItem
                            icon={MessageCircle}
                            label="Deskripsi"
                            value={warningLetter.description}
                        />
                        {warningLetter.follow_up_notes && (
                            <InfoItem
                                icon={CheckCircle2}
                                label="Catatan Tindak Lanjut"
                                value={warningLetter.follow_up_notes}
                            />
                        )}
                        {warningLetter.cancellation_reason && (
                            <InfoItem
                                icon={XCircle}
                                label="Alasan Pembatalan"
                                value={warningLetter.cancellation_reason}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function InfoItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="w-4 h-4" />
                <span>{label}</span>
            </div>
            <p className="font-medium">{value}</p>
        </div>
    )
}
