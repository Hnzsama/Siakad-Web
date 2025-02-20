import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { IconUsers, IconUserCheck } from '@tabler/icons-react'
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface GuardianDashboardProps {
    childrenData: any[];
}

export function GuardianDashboard({ childrenData }: GuardianDashboardProps) {
    const totalViolations = childrenData.reduce((acc, child) => 
        acc + (child.violations?.length || 0), 0
    );

    return (
        <>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                        <CardTitle className='text-sm font-medium'>Total Anak</CardTitle>
                        <IconUsers className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{childrenData.length}</div>
                        <p className='text-xs text-muted-foreground'>Anak terdaftar</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                        <CardTitle className='text-sm font-medium'>Total Pelanggaran</CardTitle>
                        <IconUserCheck className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{totalViolations}</div>
                        <p className='text-xs text-muted-foreground'>Pelanggaran tercatat</p>
                    </CardContent>
                </Card>
            </div>

            <div className='grid grid-cols-1 gap-4'>
                <Card>
                    <CardHeader>
                        <CardTitle>Data Anak</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {childrenData.map((child) => (
                                <div key={child.id} className="p-4 border rounded">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="font-medium">{child.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {child.nis} - {child.classroom}
                                            </p>
                                        </div>
                                        <Badge variant={child.remaining_points < 50 ? "destructive" : "default"}>
                                            {child.remaining_points} poin
                                        </Badge>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="mb-2 text-sm font-semibold">Surat Peringatan</h4>
                                            <ScrollArea className="h-[100px]">
                                                {child.warning_letters?.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {child.warning_letters.map((letter: any) => (
                                                            <div key={letter.id} className="flex justify-between p-2 text-sm border rounded">
                                                                <span>SP-{letter.level}</span>
                                                                <span className="text-muted-foreground">{letter.date}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">Tidak ada surat peringatan</p>
                                                )}
                                            </ScrollArea>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h4 className="mb-2 text-sm font-semibold">Pelanggaran</h4>
                                            <ScrollArea className="h-[100px]">
                                                {child.violations?.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {child.violations.map((violation: any) => (
                                                            <div key={violation.id} className="flex items-center justify-between p-2 text-sm border rounded">
                                                                <span>{violation.name}</span>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant="destructive">{violation.points} poin</Badge>
                                                                    <span className="text-muted-foreground">{violation.date}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">Tidak ada pelanggaran</p>
                                                )}
                                            </ScrollArea>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h4 className="mb-2 text-sm font-semibold">Pengajuan Izin</h4>
                                            <ScrollArea className="h-[100px]">
                                                {child.leave_requests?.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {child.leave_requests.map((leave: any) => (
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
                                                                <p className="text-xs text-muted-foreground">
                                                                    {leave.start_date} - {leave.end_date}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">Tidak ada pengajuan izin</p>
                                                )}
                                            </ScrollArea>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
