import React, { useState } from 'react'
import RootLayout from '@/Layouts/RootLayout'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Main } from '@/components/layout/main'
import { Head, usePage } from '@inertiajs/react'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { hasRole } from '@/utils/permissions'
import { WarningLetterInfo } from './components/warning-letter-info'
import { EmptyState } from '@/components/empty-state'
import { FileWarning, MailOpen, MailX, AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { WarningLetter, WarningLetterShowResponse } from './data/schema'
import StudentSelector from '@/components/student-selector'
import { WarningLetterReport } from './components/warning-letter-report'
import { WarningLetterCard } from './components/warning-letter-card'

function Show() {
    const { warningLetter, warningLetters = [], students = [], filters = {} } = usePage<WarningLetterShowResponse>().props
    const isGuardian = hasRole('guardian')
    const isStudent = hasRole('student')
    const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || '')

    const safeWarningLetters = Array.isArray(warningLetters) ? warningLetters : []

    const filteredWarningLetters = safeWarningLetters.filter(wl =>
        !selectedStudent || wl.student_id === selectedStudent
    )

    const readWarningLetters = filteredWarningLetters.filter(wl => wl.parent_received_at)
    const unreadWarningLetters = filteredWarningLetters.filter(wl => !wl.parent_received_at)

    const getStatusInfo = (level: number) => {
        switch (level) {
            case 3:
                return {
                    color: 'text-destructive border-destructive/50',
                    icon: AlertOctagon,
                    label: 'Peringatan Berat',
                    badge: 'destructive' as const
                }
            case 2:
                return {
                    color: 'text-orange-500 border-orange-500/50',
                    icon: AlertCircle,
                    label: 'Peringatan Sedang',
                    badge: 'default' as const
                }
            default:
                return {
                    color: 'text-yellow-500 border-yellow-500/50',
                    icon: AlertTriangle,
                    label: 'Peringatan Ringan',
                    badge: 'secondary' as const
                }
        }
    }

    if (!warningLetter && (!warningLetters || warningLetters.length === 0)) {
        return (
            <>
                <Head title="Surat Peringatan tidak ditemukan" />
                <Header fixed>
                    <Search />
                    <div className='flex items-center ml-auto space-x-4'>
                        <ThemeSwitch />
                        <ProfileDropdown />
                    </div>
                </Header>
                <Main>
                    <EmptyState
                        icon={FileWarning}
                        title="Surat Peringatan tidak ditemukan"
                        description="Data surat peringatan yang Anda cari tidak ditemukan"
                    />
                </Main>
            </>
        )
    }

    return (
        <>
            <Head title="Detail Surat Peringatan" />
            <Header fixed>
                <Search />
                <div className='flex items-center ml-auto space-x-4'>
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>
            <Main>
                {isGuardian ? (
                    <>
                        {students && students.length > 0 && (
                            <div className="flex justify-end mb-6">
                                <StudentSelector
                                    students={students}
                                    currentStudentId={selectedStudent}
                                    onChange={setSelectedStudent}
                                />
                            </div>
                        )}
                        <Tabs defaultValue="unread" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                                <TabsTrigger value="unread">
                                    <div className="flex items-center gap-2">
                                        <MailX className="w-4 h-4" />
                                        <span>Belum Dibaca ({unreadWarningLetters.length})</span>
                                    </div>
                                </TabsTrigger>
                                <TabsTrigger value="read">
                                    <div className="flex items-center gap-2">
                                        <MailOpen className="w-4 h-4" />
                                        <span>Sudah Dibaca ({readWarningLetters.length})</span>
                                    </div>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="unread" className="space-y-4">
                                {unreadWarningLetters.length === 0 ? (
                                    <EmptyState
                                        icon={MailOpen}
                                        title="Tidak ada surat peringatan yang belum dibaca"
                                        description="Semua surat peringatan sudah Anda baca"
                                    />
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {unreadWarningLetters.map(wl => (
                                            <WarningLetterCard
                                                key={wl.id}
                                                warningLetter={wl}
                                                isStudentView={false}
                                            />
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="read" className="space-y-4">
                                {readWarningLetters.length === 0 ? (
                                    <EmptyState
                                        icon={MailX}
                                        title="Belum ada surat peringatan yang dibaca"
                                        description="Anda belum membaca surat peringatan apapun"
                                    />
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {readWarningLetters.map(wl => (
                                            <WarningLetterCard
                                                key={wl.id}
                                                warningLetter={wl}
                                                isStudentView={false}
                                            />
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </>
                ) : isStudent ? (
                    <div className="space-y-6">
                        <Tabs defaultValue="unread" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                                <TabsTrigger value="unread">
                                    <div className="flex items-center gap-2">
                                        <MailX className="w-4 h-4" />
                                        <span>Belum Dibaca Ortu ({unreadWarningLetters.length})</span>
                                    </div>
                                </TabsTrigger>
                                <TabsTrigger value="read">
                                    <div className="flex items-center gap-2">
                                        <MailOpen className="w-4 h-4" />
                                        <span>Sudah Dibaca Ortu ({readWarningLetters.length})</span>
                                    </div>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="unread" className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {unreadWarningLetters.map(wl => (
                                        <WarningLetterCard
                                            key={wl.id}
                                            warningLetter={wl}
                                            isStudentView={true}
                                        />
                                    ))}
                                </div>
                                {unreadWarningLetters.length === 0 && (
                                    <EmptyState
                                        icon={MailOpen}
                                        title="Tidak ada surat peringatan yang belum dibaca"
                                        description="Semua surat peringatan sudah dibaca orang tua"
                                    />
                                )}
                            </TabsContent>

                            <TabsContent value="read" className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {readWarningLetters.map(wl => (
                                        <WarningLetterCard
                                            key={wl.id}
                                            warningLetter={wl}
                                            isStudentView={true}
                                        />
                                    ))}
                                </div>
                                {readWarningLetters.length === 0 && (
                                    <EmptyState
                                        icon={MailX}
                                        title="Belum ada surat peringatan yang dibaca"
                                        description="Orang tua belum membaca surat peringatan apapun"
                                    />
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {warningLetter && <WarningLetterInfo warningLetter={warningLetter} />}
                    </div>
                )}
            </Main>
        </>
    )
}

Show.layout = (page: React.ReactNode) => (
    <RootLayout>
        <AuthenticatedLayout>{page}</AuthenticatedLayout>
    </RootLayout>
)

export default Show
