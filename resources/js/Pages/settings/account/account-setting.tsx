import UpdateAccountInformation from './Partials/UpdateAccountInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import ContentSection from '../components/content-section';

export default function AccountSettings() {
    const tabs = [
        {
            value: 'akun',
            label: 'Akun',
            content: <UpdateAccountInformation mustVerifyEmail={false} />
        },
        {
            value: 'password',
            label: 'Kata Sandi',
            content: <UpdatePasswordForm />
        },
        {
            value: 'delete',
            label: 'Hapus Akun',
            content: <DeleteUserForm />
        },
    ];

    return <ContentSection
        title="Akun"
        desc="Perbarui pengaturan akun dan kelola profil Anda."
        tabs={tabs}
        defaultTab="akun"
    />;
}
