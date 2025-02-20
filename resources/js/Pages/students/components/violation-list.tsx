import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { BasicViolation } from '@/Pages/violations/data/schema';

export function ViolationList({ violations }: { violations: BasicViolation[] }) {
    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'resolved':
                return 'default'
            case 'in progress':
                return 'default'
            case 'pending':
                return 'secondary'
            case 'cancelled':
                return 'destructive'
            default:
                return 'outline'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status.toLowerCase()) {
            case 'resolved':
                return 'Selesai'
            case 'in progress':
                return 'Diproses'
            case 'pending':
                return 'Menunggu'
            case 'cancelled':
                return 'Dibatalkan'
            default:
                return status
        }
    }

    return (
        <div className="space-y-4">
            <h3 className="font-semibold">Riwayat Pelanggaran</h3>
            <div className="space-y-4">
                {violations?.map(violation => (
                    <div key={violation.id} className="p-4 space-y-4 border rounded-lg">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Tanggal</p>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(violation.violation_date), 'dd MMMM yyyy', { locale: id })}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Status</p>
                                <Badge variant={getStatusBadgeVariant(violation.status)}>
                                    {getStatusLabel(violation.status)}
                                </Badge>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Deskripsi</p>
                            <p className="text-sm text-muted-foreground">{violation.description}</p>
                        </div>
                    </div>
                ))}
                {(!violations || violations.length === 0) && (
                    <div className="py-6 text-center text-muted-foreground">
                        Tidak ada riwayat pelanggaran
                    </div>
                )}
            </div>
        </div>
    );
}
