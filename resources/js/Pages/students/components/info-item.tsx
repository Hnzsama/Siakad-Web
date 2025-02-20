import { Badge } from '@/components/ui/badge'
import React from 'react'

interface InfoItemProps {
    label: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
    badge?: boolean;
    variant?: "outline" | "default" | "secondary" | "destructive";
}

export function InfoItem({ label, value, icon, badge = false, variant = "outline" }: InfoItemProps) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center space-x-1.5">
                {icon && <div className="w-4 h-4 text-muted-foreground">{icon}</div>}
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
            </div>
            <div className="pl-5.5">
                {badge ? (
                    <Badge variant={variant}>
                        {value}
                    </Badge>
                ) : (
                    <p className="text-sm text-muted-foreground">{value}</p>
                )}
            </div>
        </div>
    )
}
