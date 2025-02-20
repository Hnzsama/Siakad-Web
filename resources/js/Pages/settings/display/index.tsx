import { Head } from '@inertiajs/react'
import Settings from '../layout'
import ContentSection from '../components/content-section'
import { DisplayForm } from './display-form'
import RootLayout from '@/Layouts/RootLayout'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

function SettingsDisplay() {
    return (
        <>
            <Head title="Display"/>
            <ContentSection
                title='Display'
                desc="Turn items on or off to control what's displayed in the app."
            >
                <DisplayForm />
            </ContentSection>
        </>
    )
}

SettingsDisplay.layout = (page: React.ReactNode) => (
    <RootLayout>
        <AuthenticatedLayout>
            <Settings>
                {page}
            </Settings>
        </AuthenticatedLayout>
    </RootLayout>
)

export default SettingsDisplay
