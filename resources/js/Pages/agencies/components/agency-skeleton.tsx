import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Ubah menjadi export default
export default function AgencySkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-[250px]" />
                <Skeleton className="h-4 w-[180px] mt-2" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-5 w-[200px]" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Skeleton className="w-full h-4" />
                            <Skeleton className="w-3/4 h-4" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
