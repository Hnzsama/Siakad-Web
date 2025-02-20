import { Link, router } from '@inertiajs/react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { AlertTriangle, AlertCircle, AlertOctagon, Check } from 'lucide-react'
import { WarningLetter } from '../data/schema'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import { WarningLetterReport } from './warning-letter-report'
import { useToast } from '@/hooks/use-toast'
import { Button } from "@/components/ui/button"

interface WarningLetterCardProps {
    warningLetter: WarningLetter
    isStudentView?: boolean
}

export function WarningLetterCard({ warningLetter, isStudentView }: WarningLetterCardProps) {
    const [showReport, setShowReport] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleMarkAsRead = (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent card click from triggering
        setIsLoading(true)

        router.post(
            route('warningLetters.receive', warningLetter.id),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setIsLoading(false)
                    toast({
                        title: "Berhasil",
                        description: "Surat peringatan telah ditandai sebagai dibaca",
                    })
                },
                onError: () => {
                    setIsLoading(false)
                    toast({
                        variant: "destructive",
                        title: "Gagal",
                        description: "Gagal menandai surat peringatan sebagai dibaca",
                    })
                }
            }
        )
    }

    const getStatusInfo = (level: number) => {
        switch (level) {
            case 3:
                return {
                    color: 'text-destructive border-destructive/50',
                    icon: AlertOctagon,
                    label: 'Peringatan Berat',
                    badge: 'destructive' as const
                }
            case 2:
                return {
                    color: 'text-orange-500 border-orange-500/50',
                    icon: AlertCircle,
                    label: 'Peringatan Sedang',
                    badge: 'default' as const
                }
            default:
                return {
                    color: 'text-yellow-500 border-yellow-500/50',
                    icon: AlertTriangle,
                    label: 'Peringatan Ringan',
                    badge: 'secondary' as const
                }
        }
    }

    const status = getStatusInfo(warningLetter.warning_category.level)
    const StatusIcon = status.icon

    return (
        <>
            <Card
                className="transition-colors cursor-pointer hover:border-primary"
                onClick={() => setShowReport(true)}
            >
                <div className="p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <StatusIcon className={`w-4 h-4 ${status.color}`} />
                            <span className="text-xs font-medium">No. {warningLetter.letter_number}</span>
                        </div>
                        <Badge variant={status.badge} className="text-[10px]">
                            {status.label}
                        </Badge>
                    </div>
                    <div className="space-y-2">
                        {/* Card content */}
                        <div>
                            <div className="text-[11px] text-muted-foreground mb-0.5">Nama Siswa</div>
                            <div className="text-sm font-medium">{warningLetter.student.name}</div>
                        </div>
                        <div>
                            <div className="text-[11px] text-muted-foreground mb-0.5">Kategori</div>
                            <div className="text-xs">{warningLetter.warning_category.category_name}</div>
                        </div>
                        <div>
                            <div className="text-[11px] text-muted-foreground mb-0.5">Tanggal</div>
                            <div className="text-xs">
                                {format(new Date(warningLetter.created_at), 'dd MMMM yyyy', { locale: id })}
                            </div>
                        </div>

                        {/* Mark as Read button */}
                        {!isStudentView && !warningLetter.parent_received_at && (
                            <div className="pt-2 mt-2 border-t">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={handleMarkAsRead}
                                    disabled={isLoading}
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    {isLoading ? 'Memproses...' : 'Tandai Sudah Dibaca'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            <WarningLetterReport
                open={showReport}
                onOpenChange={setShowReport}
                warningLetter={warningLetter}
                isStudentView={isStudentView}
                shouldMarkAsRead={false} // Disable auto-mark as read since we have manual button now
            />
        </>
    )
}
