import { Head, usePage } from '@inertiajs/react'
import Settings from '../layout'
import ContentSection from '../components/content-section'
import { AttendanceSettingForm } from './attendace-setting-form'
import RootLayout from '@/Layouts/RootLayout'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { AttendanceSettingResponse } from './schema'

function SettingsAttendance() {
    const { attendanceSetting } = usePage<AttendanceSettingResponse>().props

    return (
        <>
            <Head title="Pengaturan Absensi"/>
            <ContentSection
                title='Pengaturan Absensi'
                desc="Kelola pengaturan absensi seperti metode verifikasi dan batasan lokasi."
            >
                <AttendanceSettingForm attendanceSetting={attendanceSetting}/>
            </ContentSection>
        </>
    )
}

SettingsAttendance.layout = (page: React.ReactNode) => (
    <RootLayout>
        <AuthenticatedLayout>
            <Settings>
                {page}
            </Settings>
        </AuthenticatedLayout>
    </RootLayout>
)

export default SettingsAttendance
