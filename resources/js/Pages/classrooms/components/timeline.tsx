import { ReactNode } from 'react';

interface TimelineItem {
    title: string;
    description: string;
    timestamp: string;
    icon: ReactNode;
}

interface TimelineProps {
    items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
    return (
        <div className="space-y-4">
            {items.map((item, index) => (
                <div key={index} className="flex gap-4">
                    <div className="flex-none">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                            {item.icon}
                        </div>
                    </div>
                    <div className="flex-1 space-y-1">
                        <h4 className="text-sm font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
