import React, { useState } from 'react'
import RootLayout from '@/Layouts/RootLayout'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Main } from '@/components/layout/main'
import { Head, usePage } from '@inertiajs/react'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { hasAnyRole, hasRole } from '@/utils/permissions'
import { EmptyState } from '@/components/empty-state'
import { FileText } from 'lucide-react'
import StudentSelector from '@/components/student-selector'
import { LeaveRequestShowResponse } from './data/schema'
import { LeaveRequestCard } from './components/leave-request-card'
import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import Provider, { useResourceContext } from './context/context'
import { MutateDrawer } from './components/mutate-drawer'

function Content() {
    const { leaveRequest, leaveRequests = [], students = [] } = usePage<LeaveRequestShowResponse>().props
    const { open, setOpen, currentRow, setCurrentRow, resourceName } = useResourceContext()
    const isGuardian = hasRole('guardian')
    const isTeacher = hasRole('teacher')
    const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || '')

    // Modified filtering logic
    const filteredLeaveRequests = leaveRequests.filter(lr => {
        if (isTeacher) {
            // For teachers, just show all their leave requests since they're pre-filtered in the controller
            return true
        }
        // For guardian view
        return !selectedStudent || lr.leavable_id === selectedStudent
    })

    return (
        <div>
            <div className='flex flex-wrap items-center justify-between mb-6 space-y-2 gap-x-4'>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Detail Izin</h2>
                    <p className='text-muted-foreground'>
                        Detail pengajuan izin {isGuardian ? 'siswa' : isTeacher ? 'Anda' : ''}.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {isGuardian && students && students.length > 1 && (
                        <StudentSelector
                            students={students}
                            currentStudentId={selectedStudent}
                            onChange={setSelectedStudent}
                        />
                    )}
                    {(isTeacher || isGuardian) && (
                        <Button className='space-x-1' onClick={() => setOpen('create')}>
                            <span>Tambah</span> <IconPlus size={18} />
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredLeaveRequests.map(leaveRequest => (
                    <LeaveRequestCard
                        key={leaveRequest.id}
                        leaveRequest={leaveRequest}
                    />
                ))}
            </div>

            {filteredLeaveRequests.length === 0 && (
                <EmptyState
                    icon={FileText}
                    title="Tidak ada izin"
                    description={
                        isTeacher ? "Tidak ada data izin untuk Anda" :
                            isGuardian ? "Tidak ada data izin untuk siswa ini" :
                                "Data izin tidak ditemukan"
                    }
                />
            )}

            {hasAnyRole(['teacher', 'guardian']) && (
                <>
                    <MutateDrawer
                        key={`${resourceName.toLocaleLowerCase()}-create`}
                        open={open === 'create'}
                        onOpenChange={() => setOpen('create')}
                    />

                    {currentRow && (
                        <MutateDrawer
                            key={`${resourceName.toLocaleLowerCase()}-update-${currentRow.id}`}
                            open={open === 'update'}
                            onOpenChange={() => {
                                setOpen('update')
                                setTimeout(() => {
                                    setCurrentRow(null)
                                }, 500)
                            }}
                            currentRow={currentRow}
                        />
                    )}
                </>
            )}
        </div>
    )
}

function Show() {
    return (
        <Provider>
            <Head title="Detail Izin" />
            <Header fixed>
                <Search />
                <div className='flex items-center ml-auto space-x-4'>
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>
            <Main>
                <Content />
            </Main>
        </Provider>
    )
}

Show.layout = (page: React.ReactNode) => (
    <RootLayout>
        <AuthenticatedLayout>{page}</AuthenticatedLayout>
    </RootLayout>
)

export default Show
