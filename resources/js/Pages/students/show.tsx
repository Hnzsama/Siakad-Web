import React, { useState } from 'react'
import RootLayout from '@/Layouts/RootLayout'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import StudentProvider from './context/context'
import { Main } from '@/components/layout/main'
import { Head, usePage } from '@inertiajs/react'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Calendar } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { hasRole } from '@/utils/permissions'
import { StudentInfo } from './components/student-info'
import { ViolationList } from './components/violation-list'
import { AttendanceHistory } from './components/attendance-history'
import { LeaveRequestList } from './components/leave-request-list'
import { WarningLetterList } from './components/warning-letter-list'
import { StudentShowResponse } from './data/schema'
import StudentSelector from '@/components/student-selector'
import { EmptyState } from '@/components/empty-state'
import { UserRound } from 'lucide-react'

function Show() {
    const { student, students } = usePage<StudentShowResponse>().props
    const isAdmin = hasRole('admin')
    const isGuardian = hasRole('guardian')
    const [selectedStudentId, setSelectedStudentId] = useState(students?.[0]?.id || '')
    const selectedStudent = students?.find(s => s.id === selectedStudentId)

    // Handle student not found
    if (!student && !students?.length) {
        return (
            <>
                <Head title="Siswa tidak ditemukan" />
                <Header fixed>
                    <Search />
                    <div className='flex items-center ml-auto space-x-4'>
                        <ThemeSwitch />
                        <ProfileDropdown />
                    </div>
                </Header>
                <Main>
                    <EmptyState
                        icon={UserRound}
                        title="Siswa tidak ditemukan"
                        description="Data siswa yang Anda cari tidak ditemukan"
                    />
                </Main>
            </>
        )
    }

    // Handle multiple students view (for guardian)
    if (students?.length) {
        return (
            <>
                <Head title="Detail Siswa" />
                <Header fixed>
                    <Search />
                    <div className='flex items-center ml-auto space-x-4'>
                        <ThemeSwitch />
                        <ProfileDropdown />
                    </div>
                </Header>
                <Main>
                    <div>
                        <div className='flex flex-wrap items-center justify-between mb-6 space-y-2 gap-x-4'>
                            <div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold tracking-tight">{selectedStudent?.name}</h2>
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        <span>NIS: {selectedStudent?.nis}</span>
                                    </div>
                                </div>
                            </div>
                            <StudentSelector
                                students={students}
                                currentStudentId={selectedStudentId}
                                onChange={setSelectedStudentId}
                            />
                        </div>

                        <div className='flex-1 px-4 py-4 -mx-4 space-y-8 overflow-auto border-t'>
                            <div className="space-y-6">
                                <Tabs defaultValue="info" className="space-y-6">
                                    <TabsList className="w-full grid grid-cols-5 lg:w-[600px]">
                                        <TabsTrigger value="info">Informasi</TabsTrigger>
                                        <TabsTrigger value="attendance">Kehadiran</TabsTrigger>
                                        <TabsTrigger value="violations">Pelanggaran</TabsTrigger>
                                        <TabsTrigger value="leaves">Izin</TabsTrigger>
                                        <TabsTrigger value="warnings">SP</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="info" className="space-y-6">
                                        <StudentInfo student={selectedStudent} isAdmin={isAdmin} />
                                    </TabsContent>

                                    <TabsContent value="attendance" className="space-y-6">
                                        <AttendanceHistory attendances={selectedStudent?.attendances ?? []} />
                                    </TabsContent>

                                    <TabsContent value="violations" className="space-y-6">
                                        <ViolationList violations={selectedStudent?.violations ?? []} />
                                    </TabsContent>

                                    <TabsContent value="leaves" className="space-y-6">
                                        <LeaveRequestList leaveRequests={selectedStudent?.leave_requests ?? []} />
                                    </TabsContent>

                                    <TabsContent value="warnings" className="space-y-6">
                                        <WarningLetterList warningLetters={selectedStudent?.warning_letters ?? []} />
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </Main>
            </>
        )
    }

    // Handle single student view
    return (
        <StudentProvider>
            <Head title={`Siswa: ${student?.name}`} />
            <Header fixed>
                <Search />
                <div className='flex items-center ml-auto space-x-4'>
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>
            <Main>
                <div>
                    <div className='flex flex-wrap items-center justify-between mb-6 space-y-2 gap-x-4'>
                        <div>
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold tracking-tight">{student?.name}</h2>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span>NIS: {student?.nis}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex-1 px-4 py-4 -mx-4 space-y-8 overflow-auto border-t'>
                        <div className="space-y-6">
                            <Tabs defaultValue="info" className="space-y-6">
                                <TabsList className="w-full grid grid-cols-5 lg:w-[600px]">
                                    <TabsTrigger value="info">Informasi</TabsTrigger>
                                    <TabsTrigger value="attendance">Kehadiran</TabsTrigger>
                                    {(isAdmin || isGuardian) && (
                                        <>
                                            <TabsTrigger value="violations">Pelanggaran</TabsTrigger>
                                            <TabsTrigger value="leaves">Izin</TabsTrigger>
                                            <TabsTrigger value="warnings">SP</TabsTrigger>
                                        </>
                                    )}
                                </TabsList>

                                <TabsContent value="info" className="space-y-6">
                                    <StudentInfo student={student} isAdmin={isAdmin} />
                                </TabsContent>

                                <TabsContent value="attendance" className="space-y-6">
                                    <AttendanceHistory attendances={student?.attendances ?? []} />
                                </TabsContent>

                                {(isAdmin || isGuardian) && (
                                    <>
                                        <TabsContent value="violations" className="space-y-6">
                                            <ViolationList violations={student?.violations ?? []} />
                                        </TabsContent>

                                        <TabsContent value="leaves" className="space-y-6">
                                            <LeaveRequestList leaveRequests={student?.leave_requests ?? []} />
                                        </TabsContent>

                                        <TabsContent value="warnings" className="space-y-6">
                                            <WarningLetterList warningLetters={student?.warning_letters ?? []} />
                                        </TabsContent>
                                    </>
                                )}
                            </Tabs>
                        </div>
                    </div>
                </div>
            </Main>
        </StudentProvider>
    )
}

Show.layout = (page: React.ReactNode) => (
    <RootLayout>
        <AuthenticatedLayout>{page}</AuthenticatedLayout>
    </RootLayout>
)

export default Show
