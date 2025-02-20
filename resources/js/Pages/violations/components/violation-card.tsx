import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { AlertTriangle, Calendar, User, FileText } from 'lucide-react'
import { Violation } from '../data/schema'
import { ViolationDialog } from './violation-dialog'

interface ViolationCardProps {
    violation: Violation;
}

export function ViolationCard({ violation }: ViolationCardProps){
    return (
        <ViolationDialog
            violation={violation}
            trigger={
                <Card className="overflow-hidden transition-all hover:shadow-md hover:border-primary">
                    <div className="p-4 space-y-4">
                        {/* Header with violation type and points */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900/20">
                                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium">{violation.violation_type.name}</h3>
                                    <p className="text-xs text-muted-foreground">
                                        {format(new Date(violation.violation_date), 'EEEE', { locale: id })}
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant={violation.status === 'approved' ? "destructive" : "secondary"}
                                className="h-6 truncate"
                            >
                                {violation.status === 'approved'
                                    ? `-${violation.violation_type.points} poin`
                                    : 'Menunggu'}
                            </Badge>
                        </div>

                        {/* Content */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span>{violation.student.name}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>
                                    {format(new Date(violation.violation_date), 'dd MMMM yyyy', { locale: id })}
                                </span>
                            </div>

                            {violation.description && (
                                <div className="flex gap-2 pt-2 mt-2 text-sm border-t">
                                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                                    <p className="text-muted-foreground line-clamp-2">
                                        {violation.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            }
        />
    )
}
