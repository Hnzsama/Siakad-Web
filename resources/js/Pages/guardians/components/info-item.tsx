import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

interface InfoItemProps {
    icon: ReactNode;
    label: string;
    value: string;
    badge?: boolean;
    variant?: "outline" | "default" | "secondary" | "destructive";
    className?: string;
}

export default function InfoItem({ icon, label, value, badge, variant = "outline", className }: InfoItemProps) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            <div className="flex items-center space-x-1.5">
                <div className="w-4 h-4 text-muted-foreground">{icon}</div>
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
    );
}
