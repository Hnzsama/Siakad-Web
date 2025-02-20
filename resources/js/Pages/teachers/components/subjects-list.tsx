import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Subject } from '@/Pages/subjects/data/schema'

export function SubjectsList({ subjects }: { subjects: Subject[] }) {
    if (!subjects?.length) return null;

    return (
        <Card className="transition-all duration-300 hover:shadow-lg border-0 bg-gradient-to-br from-background via-background to-muted/30">
            <CardHeader className="border-b bg-muted/10">
                <CardTitle className="text-xl font-semibold">
                    Mata Pelajaran yang Diampu
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 p-6">
                {subjects.map(subject => (
                    <div
                        key={subject.id}
                        className="group relative p-4 rounded-lg transition-all duration-200 hover:bg-muted/50 border border-border/50"
                    >
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-foreground/70">Kode</p>
                                <p className="text-base font-medium group-hover:text-primary transition-colors">
                                    {subject.code}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-foreground/70">Nama</p>
                                <p className="text-base font-medium group-hover:text-primary transition-colors">
                                    {subject.name}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-foreground/70">Tipe</p>
                                <p className="text-base font-medium group-hover:text-primary transition-colors capitalize">
                                    {subject.type}
                                </p>
                            </div>
                            <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                                <p className="text-sm font-medium text-foreground/70">Deskripsi</p>
                                <p className="text-base font-medium group-hover:text-primary transition-colors">
                                    {subject.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
