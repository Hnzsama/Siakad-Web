import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { GraduationCap, CalendarDays, School, User2, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type StudentListItem = {
    id: string;
    nis: string;
    name: string;
    status: "Active" | "Graduated" | "Dropped Out";
    enrollment_date: string;
    classroom?: {
        name?: string;
    } | null;
};

interface StudentListProps {
    students: StudentListItem[];
}

export function StudentList({ students }: StudentListProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
            case "Graduated":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
            case "Dropped Out":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {students.map((student) => (
                <Card key={student.id} className="group overflow-hidden transition-all hover:shadow-lg border-muted/50">
                    <CardHeader className="p-6 bg-muted/30">
                        <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12 border-2">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                    {getInitials(student.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline" className={`${getStatusColor(student.status)}`}>
                                        {student.status}
                                    </Badge>
                                    <p className="font-mono text-sm text-muted-foreground">
                                        {student.nis}
                                    </p>
                                </div>
                                <Link
                                    href={route('students.show', student.id)}
                                    className="block text-lg font-semibold hover:text-primary transition-colors"
                                >
                                    {student.name}
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <School className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">{student.classroom?.name || 'Belum ada kelas'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                        Masuk: {formatDate(student.enrollment_date)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex md:justify-end">
                                <Link href={route('students.show', student.id)}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full md:w-auto group-hover:border-primary group-hover:text-primary transition-colors"
                                    >
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Detail
                                        <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
