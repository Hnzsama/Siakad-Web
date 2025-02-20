import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <Icon className="w-16 h-16 text-muted-foreground" />
            <div className="space-y-2 text-center">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    )
}
