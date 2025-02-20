import { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface InfoItemProps {
    icon?: ReactNode
    label: string
    value?: string | number | null
    badge?: boolean
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
    className?: string
}

export default function InfoItem({
    icon,
    label,
    value,
    badge = false,
    variant = 'default',
    className
}: InfoItemProps) {
    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center gap-2">
                {icon}
                <p className="text-sm font-medium text-foreground/70">{label}</p>
            </div>
            {badge ? (
                <Badge variant={variant} className="font-medium">
                    {value}
                </Badge>
            ) : (
                <p className="text-base font-medium">{value}</p>
            )}
        </div>
    )
}
