import { Card } from '@/components/ui/card';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';
import { ResetPasswordForm } from './components/reset-password-form';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    return (
        <GuestLayout>
            <Head title="Reset Password" />
            <Card className='p-6'>
                <div className='flex flex-col mb-2 space-y-2 text-left'>
                    <h1 className='text-lg font-semibold tracking-tight'>
                        Reset Password
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Please enter your new password below.
                    </p>
                </div>
                <ResetPasswordForm token={token} email={email} />
            </Card>
        </GuestLayout>
    );
}
