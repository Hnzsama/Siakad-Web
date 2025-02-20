import { BasicWarningLetter, WarningLetter } from '@/Pages/warningLetters/data/schema'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { FileText, AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function WarningLetterList({ warningLetters }: { warningLetters: any[] }) {
    const getStatusInfo = (level: number) => {
        switch (level) {
            case 3:
                return {
                    color: 'text-destructive border-destructive/50',
                    icon: AlertOctagon,
                    label: 'Peringatan Berat',
                    badge: 'destructive' as const,
                    sp: 'SP3'
                }
            case 2:
                return {
                    color: 'text-orange-500 border-orange-500/50',
                    icon: AlertCircle,
                    label: 'Peringatan Sedang',
                    badge: 'default' as const,
                    sp: 'SP2'
                }
            default:
                return {
                    color: 'text-yellow-500 border-yellow-500/50',
                    icon: AlertTriangle,
                    label: 'Peringatan Ringan',
                    badge: 'secondary' as const,
                    sp: 'SP1'
                }
        }
    }

    const WarningCard = ({ letter }: { letter: WarningLetter }) => {
        const statusInfo = getStatusInfo(letter.warning_category.level)
        const StatusIcon = statusInfo.icon

        return (
            <Card
                key={letter.id}
                className={cn(
                    "relative overflow-hidden transition-all hover:shadow-md",
                    "before:absolute before:left-0 before:top-0 before:h-full before:w-1",
                    statusInfo.color
                )}
            >
                <div className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                                <StatusIcon className="w-4 h-4" />
                                <p className="font-medium line-clamp-1">
                                    {statusInfo.label}
                                </p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {format(new Date(letter.issued_date), 'dd MMMM yyyy', { locale: id })}
                            </p>
                        </div>
                        <Badge variant={statusInfo.badge}>
                            {statusInfo.sp}
                        </Badge>
                    </div>

                    {/* Category & Content */}
                    <div className="space-y-2">
                        <div>
                            <p className="text-sm font-medium">
                                {letter.warning_category.category_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {letter.letter_number}
                            </p>
                        </div>
                        <p className="text-sm line-clamp-2">
                            {letter.description}
                        </p>
                    </div>

                    {/* Action */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => letter.document_path && window.open(letter.document_path, '_blank')}
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Lihat Detail
                    </Button>
                </div>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">Surat Peringatan</h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <span>SP1</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <span>SP2</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <AlertOctagon className="w-4 h-4 text-destructive" />
                        <span>SP3</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {warningLetters?.map(letter => (
                    <WarningCard key={letter.id} letter={letter} />
                ))}
            </div>

            {(!warningLetters || warningLetters.length === 0) && (
                <div className="py-8 text-center border rounded-lg bg-muted/10">
                    <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                        Tidak ada surat peringatan
                    </p>
                </div>
            )}
        </div>
    )
}
