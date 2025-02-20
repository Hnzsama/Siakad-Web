import { cn } from '@/lib/utils'
import React from 'react'

interface StatCardProps {
    icon: React.ReactNode,
    label: string,
    value: React.ReactNode | string,
    className?: string
}

export function StatCard({ icon, label, value, className }: StatCardProps) {
    return (
        <div className={cn("flex items-center p-4 space-x-4 border rounded-lg", className)}>
            {icon}
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <div className="text-lg font-semibold">{value}</div>
            </div>
        </div>
    )
}
