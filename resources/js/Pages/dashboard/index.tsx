import RootLayout from '@/Layouts/RootLayout'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Head, usePage } from '@inertiajs/react'
import { PageProps } from '@/types'
import { User } from '../users/data/schema'
import { hasRole } from '@/utils/permissions'
import { StudentDashboard } from './components/StudentDashboard'
import { TeacherDashboard } from './components/TeacherDashboard'
import { GuardianDashboard } from './components/GuardianDashboard'
import { AdminDashboard } from './components/AdminDashboard'

interface Response extends PageProps {
    totalStudents?: number;
    totalTeachers?: number;
    totalGuardians?: number;
    totalUsers?: number;
    studentsPerClass?: any[];
    childrenData?: any[];
    studentData?: any;
    topViolators?: any[];
    auth: {
        user: User;
    }
    isHomeroom?: boolean;
}

function Dashboard() {
    const props = usePage<Response>().props

    const getDashboardContent = () => {
        if (hasRole('teacher')) {
            return <TeacherDashboard 
                studentsPerClass={props.studentsPerClass ?? []} 
                isHomeroom={props.isHomeroom ?? false} 
            />
        }
        if (hasRole('guardian')) {
            return <GuardianDashboard childrenData={props.childrenData ?? []} />
        }
        if (hasRole('student')) {
            return <StudentDashboard studentData={props.studentData} />
        }
        return <AdminDashboard {...props} />
    }

    return (
        <>
            <Head title='Dashboard' />
            <Header>
                <Search />
                <div className='flex items-center ml-auto space-x-4'>
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>

            <Main>
                <div className='flex items-center justify-between mb-6'>
                    <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
                </div>

                <div className='space-y-6'>
                    {getDashboardContent()}
                </div>
            </Main>
        </>
    )
}

Dashboard.layout = (page: React.ReactNode) => (
    <RootLayout>
        <AuthenticatedLayout>{page}</AuthenticatedLayout>
    </RootLayout>
)

export default Dashboard
