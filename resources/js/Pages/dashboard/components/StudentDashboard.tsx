import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface StudentData {
    name: string;
    nis: string;
    classroom: string;
    remaining_points: number;
    attendances: {
        id: number;
        date: string;
        status: string;
        time: string;
    }[];
    warning_letters: {
        id: number;
        level: number;
        date: string;
    }[];
    violations: {
        id: number;
        name: string;
        points: number;
        date: string;
    }[];
    leave_requests: {
        id: number;
        type: string;
        status: string;
        start_date: string;
        end_date: string;
    }[];
}

export function StudentDashboard({ studentData }: { studentData: StudentData }) {
    return (
        <div className='grid gap-4 md:grid-cols-2'>
            <Card className='md:col-span-2'>
                <CardHeader>
                    <CardTitle>Data Saya</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="font-medium">{studentData.name}</span>
                            <span className="text-muted-foreground">{studentData.nis}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Kelas: {studentData.classroom}</span>
                            <Badge variant={studentData.remaining_points < 50 ? "destructive" : "default"}>
                                Poin: {studentData.remaining_points}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Absensi Minggu Ini</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[200px]">
                        {studentData.attendances.length > 0 ? (
                            <div className="space-y-2">
                                {studentData.attendances.map((attendance) => (
                                    <div key={attendance.id} className="flex items-center justify-between p-2 border rounded">
                                        <div>
                                            <p className="text-sm font-medium">{attendance.date}</p>
                                            <p className="text-xs text-muted-foreground">{attendance.time}</p>
                                        </div>
                                        <Badge variant={
                                            attendance.status === 'Hadir' ? 'default' :
                                            attendance.status === 'Terlambat' ? 'secondary' : 'destructive'
                                        }>
                                            {attendance.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Belum ada data absensi minggu ini</p>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Surat Peringatan</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[200px]">
                        {studentData.warning_letters.length > 0 ? (
                            <div className="space-y-2">
                                {studentData.warning_letters.map((letter) => (
                                    <div key={letter.id} className="flex items-center justify-between p-2 border rounded">
                                        <span className="font-medium">SP-{letter.level}</span>
                                        <span className="text-sm text-muted-foreground">{letter.date}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Tidak ada surat peringatan</p>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>

            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle>Riwayat Pelanggaran</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[200px]">
                        {studentData.violations.length > 0 ? (
                            <div className="space-y-2">
                                {studentData.violations.map((violation) => (
                                    <div key={violation.id} className="p-2 border rounded">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{violation.name}</span>
                                            <Badge variant="destructive">{violation.points} poin</Badge>
                                        </div>
                                        <span className="text-sm text-muted-foreground">{violation.date}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Tidak ada pelanggaran</p>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>

            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle>Pengajuan Izin</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[200px]">
                        {studentData.leave_requests.length > 0 ? (
                            <div className="space-y-2">
                                {studentData.leave_requests.map((leave) => (
                                    <div key={leave.id} className="p-2 border rounded">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{leave.type}</span>
                                            <Badge variant={
                                                leave.status === 'Approved' ? 'default' :
                                                leave.status === 'Rejected' ? 'destructive' : 'secondary'
                                            }>
                                                {leave.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {leave.start_date} - {leave.end_date}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Tidak ada pengajuan izin</p>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
