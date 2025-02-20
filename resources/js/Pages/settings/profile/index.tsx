import { Head } from '@inertiajs/react'
import Settings from '../layout'
import ContentSection from '../components/content-section'
import ProfileForm from './profile-form'
import RootLayout from '@/Layouts/RootLayout'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import ProfileSettings from './profile-setting'

function SettingsProfile() {
    return (
        <>
            <Head title="Profil" />
            <ProfileSettings />
        </>
    )
}

SettingsProfile.layout = (page: React.ReactNode) => (
    <RootLayout>
        <AuthenticatedLayout>
            <Settings>
                {page}
            </Settings>
        </AuthenticatedLayout>
    </RootLayout>
)

export default SettingsProfile

