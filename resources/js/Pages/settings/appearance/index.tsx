import { Head } from '@inertiajs/react'
import Settings from '../layout'
import ContentSection from '../components/content-section'
import { AppearanceForm } from './appearance-form'
import RootLayout from '@/Layouts/RootLayout'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

function SettingsAppearance() {
    return (
        <>
            <Head title="Appearance"/>
            <ContentSection
                title='Appearance'
                desc='Customize the appearance of the app. Automatically switch between day
          and night themes.'
            >
                <AppearanceForm />
            </ContentSection>
        </>
    )
}

SettingsAppearance.layout = (page: React.ReactNode) => (
    <RootLayout>
        <AuthenticatedLayout>
            <Settings>
                {page}
            </Settings>
        </AuthenticatedLayout>
    </RootLayout>
)

export default SettingsAppearance
