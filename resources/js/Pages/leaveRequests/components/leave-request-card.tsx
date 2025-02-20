import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar, Clock, User, FileText } from "lucide-react"
import { FullLeaveRequest } from "../data/schema"
import { useResourceContext } from "../context/context"

export function LeaveRequestCard({
    leaveRequest
}: {
    leaveRequest: FullLeaveRequest
}) {
    const { setOpen, setCurrentRow } = useResourceContext()

    const handleClick = () => {
        setCurrentRow(leaveRequest)
        setOpen('update')
    }

    return (
        <Card
            className="overflow-hidden transition-all cursor-pointer hover:shadow-md hover:border-primary"
            onClick={handleClick}
        >
            <div className="p-4 space-y-4">
                {/* Header with leave type and status */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/20">
                            <Calendar className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium">
                                {leaveRequest.leave_type.leave_name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                {format(new Date(leaveRequest.start_date), 'EEEE', { locale: id })}
                            </p>
                        </div>
                    </div>
                    <Badge variant={
                        leaveRequest.status === 'Approved' ? 'default' :
                        leaveRequest.status === 'Rejected' ? 'destructive' :
                        'secondary'
                    } className="h-6">
                        {leaveRequest.status}
                    </Badge>
                </div>

                {/* Content */}
                <div className="space-y-3">
                    {/* Leavable Name */}
                    <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{leaveRequest.leavable.name}</span>
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>
                            {format(new Date(leaveRequest.start_date), 'dd MMMM yyyy', { locale: id })}
                            {' - '}
                            {format(new Date(leaveRequest.end_date), 'dd MMMM yyyy', { locale: id })}
                        </span>
                    </div>

                    {/* Reason */}
                    {leaveRequest.reason && (
                        <div className="flex gap-2 pt-2 mt-2 text-sm border-t">
                            <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                            <p className="text-muted-foreground line-clamp-2">
                                {leaveRequest.reason}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}