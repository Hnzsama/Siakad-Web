import React, { useState, useEffect } from 'react'
import RootLayout from '@/Layouts/RootLayout'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Main } from '@/components/layout/main'
import { Head, usePage } from '@inertiajs/react'
import { TeacherShowResponse, Teacher } from './data/schema'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import TeacherInfo from './components/teacher-info'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from 'lucide-react'
import { hasRole } from '@/utils/permissions'
import { ScheduleList } from './components/schedule-list'
import { AttendanceHistory } from './components/attendance-history'
import { ClassroomInfo } from './components/classroom-info'
import { SubjectsList } from './components/subjects-list'
import StudentSelector from '../../components/student-selector'
import { EmptyState } from '@/components/empty-state'
import { GraduationCap } from 'lucide-react'

function Show() {
    const { teachers, teacher, students } = usePage<TeacherShowResponse>().props
    const isAdmin = hasRole('admin')
    const [selectedStudent, setSelectedStudent] = useState(students?.[0]?.id || '')
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | undefined>(() => {
        if (!students?.[0]) return teacher
        const defaultTeacherId = students[0]?.classroom?.teacher_id
        return teachers?.find(t => t.id === defaultTeacherId)
    })
    const [isLoading, setIsLoading] = useState(true)

    console.log([
        'teachers', teachers,
        'students', students,
    ])

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000)
        return () => clearTimeout(timer)
    }, [])

    if (!teacher && !teachers?.length) {
        return (
            <>
                <Head title="Guru tidak ditemukan" />
                <Header fixed>
                    <Search />
                    <div className='flex items-center ml-auto space-x-4'>
                        <ThemeSwitch />
                        <ProfileDropdown />
                    </div>
                </Header>
                <Main>
                    <EmptyState
                        icon={GraduationCap}
                        title="Guru tidak ditemukan"
                        description="Data guru yang Anda cari tidak ditemukan"
                    />
                </Main>
            </>
        )
    }

    if (isAdmin && teacher) {
        return (
            <>
                <Head title={`Guru: ${teacher.name}`} />
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
                                    <h2 className="text-2xl font-bold tracking-tight">{teacher.name}</h2>
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        <span>{teacher.subject}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='flex-1 px-4 py-4 -mx-4 space-y-8 overflow-auto border-t'>
                            <div className="space-y-6">
                                <TeacherInfo teacher={teacher} isAdmin />
                                <ClassroomInfo teacher={teacher} isAdmin />

                                <Tabs defaultValue="schedule" className="space-y-6">
                                    <TabsList className="w-full grid grid-cols-2 lg:w-[400px]">
                                        <TabsTrigger value="schedule">Jadwal</TabsTrigger>
                                        <TabsTrigger value="history">Riwayat Kehadiran</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="schedule" className="space-y-6">
                                        <ScheduleList schedules={teacher?.class_subjects || []} />
                                    </TabsContent>

                                    <TabsContent value="history" className="space-y-6">
                                        <AttendanceHistory attendances={teacher?.attendances || []} />
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </Main>
            </>
        )
    }

    return (
        <>
            <Head title={`Guru: ${selectedTeacher?.name || 'Detail'}`} />
            <Header fixed>
                <Search />
                <div className='flex items-center ml-auto space-x-4'>
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>
            <Main>
                {selectedTeacher && (
                    <div>
                        <div className='flex flex-wrap items-center justify-between mb-6 space-y-2 gap-x-4'>
                            <div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold tracking-tight">{selectedTeacher.name}</h2>
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        <span>{selectedTeacher.subject}</span>
                                    </div>
                                </div>
                            </div>
                            {teachers && students && (
                                <StudentSelector
                                    students={students}
                                    currentStudentId={selectedStudent}
                                    onChange={(value) => {
                                        setSelectedStudent(value)
                                        const student = students.find(s => s.id === value)
                                        const foundTeacher = teachers.find(t => t.id === student?.classroom?.teacher_id)
                                        setSelectedTeacher(foundTeacher)
                                    }}
                                />
                            )}
                        </div>

                        <div className='flex-1 px-4 py-4 -mx-4 space-y-8 overflow-auto border-t'>
                            <div className="space-y-6">
                                <TeacherInfo teacher={selectedTeacher} />
                                {selectedTeacher.homeroom_teacher && (
                                    <ClassroomInfo teacher={selectedTeacher} />
                                )}
                            </div>
                        </div>
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
