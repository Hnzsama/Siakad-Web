import React from 'react'
import RootLayout from '@/Layouts/RootLayout'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import GuardianProvider from './context/context'
import { Main } from '@/components/layout/main'
import { Head, usePage } from '@inertiajs/react'
import { GuardianShowResponse } from './data/schema'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { GuardianInfo } from './components/guardian-info'
import { StudentList } from './components/guardian-student-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from 'lucide-react'
import { hasRole } from '@/utils/permissions'

function Show() {
    const { guardian } = usePage<GuardianShowResponse>().props;
    const studentLabel = hasRole('admin') ? 'Siswa' : 'Saudara';

    return (
        <GuardianProvider>
            <Head title={`Wali: ${guardian.name}`} />
            <Header fixed>
                <Search />
                <div className='flex items-center ml-auto space-x-4'>
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>
            <Main>
                <div>
                    {/* Header with action buttons */}
                    <div className='flex flex-wrap items-center justify-between px-4 mb-0 -mx-4 space-y-2 gap-x-4'>
                        <div>
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold tracking-tight">{guardian.name}</h2>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span>{guardian.relationship}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main content with full-width border */}
                    <div className='flex-1 px-4 py-4 mt-6 -mx-4 space-y-8 border-t'>
                        <div className="space-y-6">
                            <GuardianInfo guardian={guardian} />

                            <Tabs defaultValue="students" className="space-y-6">
                                {/* <TabsList className="w-full grid grid-cols-2 lg:w-[400px]">
                                    <TabsTrigger value="students">Daftar {studentLabel}</TabsTrigger>
                                    <TabsTrigger value="history">Riwayat</TabsTrigger>
                                </TabsList> */}

                                <TabsContent value="students" className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-lg font-semibold">Daftar {studentLabel}</h2>
                                                <p className="text-sm text-muted-foreground">
                                                    {guardian.children?.length || 0} {studentLabel} terdaftar
                                                </p>
                                            </div>
                                        </div>
                                        <StudentList students={guardian.children || []} />
                                    </div>
                                </TabsContent>

                                <TabsContent value="history">
                                    {/* History content */}
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </Main>
        </GuardianProvider>
    );
}

Show.layout = (page: React.ReactNode) => (
    <RootLayout>
        <AuthenticatedLayout>{page}</AuthenticatedLayout>
    </RootLayout>
)

export default Show
