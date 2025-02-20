import { Head } from '@inertiajs/react'
import Settings from '../layout'
import ContentSection from '../components/content-section'
import { NotificationsForm } from './notifications-form'
import RootLayout from '@/Layouts/RootLayout'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

function SettingsNotifications() {
    return (
        <>
            <Head title="Notifications"/>
            <ContentSection
                title='Notifications'
                desc='Configure how you receive notifications.'
            >
                <NotificationsForm />
            </ContentSection>
        </>
    )
}

SettingsNotifications.layout = (page: React.ReactNode) => (
    <RootLayout>
        <AuthenticatedLayout>
            <Settings>
                {page}
            </Settings>
        </AuthenticatedLayout>
    </RootLayout>
)

export default SettingsNotifications
