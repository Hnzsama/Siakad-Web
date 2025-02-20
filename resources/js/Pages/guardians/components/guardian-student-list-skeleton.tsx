import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function StudentListSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                    <CardHeader className="p-6 bg-muted/30">
                        <div className="flex items-start gap-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-5 w-20" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <Skeleton className="h-6 w-[200px]" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-4 w-[150px]" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-4 w-[120px]" />
                                </div>
                            </div>
                            <div className="flex md:justify-end">
                                <Skeleton className="h-9 w-[100px]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
