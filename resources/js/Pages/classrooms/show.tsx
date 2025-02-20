import React from 'react'
import RootLayout from '@/Layouts/RootLayout'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import ClassroomProvider from './context/context'
import { Main } from '@/components/layout/main'
import { Head, usePage } from '@inertiajs/react'
import { ClassroomShowResponse } from './data/schema'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ClassroomInfo } from './components/classroom-info'
import { StudentList } from './components/student-list'
import { Button } from '@/components/ui/button'
import { Calendar, CalendarRange } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AttendanceList } from './components/attendance-list'

function Show() {
    const { classroom, attendances, average, percentage } = usePage<ClassroomShowResponse>().props;

    return (
        <ClassroomProvider>
            <Head title={`Class: ${classroom.name}`} />
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
                                <h2 className="text-2xl font-bold tracking-tight">{classroom.name}</h2>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span>Ruang {classroom.room_number}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex-1 px-4 py-4 -mx-4 space-y-8 overflow-auto border-t'>
                        <div className="space-y-6">
                            <ClassroomInfo classroom={classroom} average={average} percentage={percentage} teacher={classroom.homeroom_teacher} />

                            <Tabs defaultValue="students" className="space-y-6">
                                {/* <TabsList className="w-full grid grid-cols-2 lg:w-[400px]">
                                    <TabsTrigger value="students">Siswa</TabsTrigger>
                                    <TabsTrigger value="attendance">Absensi</TabsTrigger>
                                </TabsList> */}

                                <TabsContent value="students" className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-lg font-semibold">Daftar Siswa</h2>
                                                <p className="text-sm text-muted-foreground">
                                                    {classroom.students?.length || 0} siswa terdaftar
                                                </p>
                                            </div>
                                        </div>
                                        <StudentList students={classroom.students} />
                                    </div>
                                </TabsContent>

                                <TabsContent value="attendance" className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-lg font-semibold">Absensi Kelas</h2>
                                                <p className="text-sm text-muted-foreground">
                                                    Rekap absensi siswa
                                                </p>
                                            </div>
                                        </div>
                                        <AttendanceList attendances={attendances} />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </Main>
        </ClassroomProvider>
    )
}

Show.layout = (page: React.ReactNode) => (
    <RootLayout>
        <AuthenticatedLayout>{page}</AuthenticatedLayout>
    </RootLayout>
)

export default Show
