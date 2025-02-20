import RootLayout from '@/Layouts/RootLayout'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Settings from '../layout'
import ContentSection from '../components/content-section'
import { Head } from '@inertiajs/react'
import AccountSettings from './account-setting'

function SettingsAccount() {
    return (
        <>
            <Head title="Akun" />
            <AccountSettings />
        </>
    )
}

SettingsAccount.layout = (page: React.ReactNode) => (
    <RootLayout>
        <AuthenticatedLayout>
            <Settings>
                {page}
            </Settings>
        </AuthenticatedLayout>
    </RootLayout>
)

export default SettingsAccount
