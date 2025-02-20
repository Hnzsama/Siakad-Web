import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function GuardianInfoSkeleton() {
    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                    <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                                <Skeleton className="h-5 w-[180px]" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <Skeleton className="h-4 w-20" />
                </CardHeader>
                <CardContent className="space-y-6">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-9 w-full" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
