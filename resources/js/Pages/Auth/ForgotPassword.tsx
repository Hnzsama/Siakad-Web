import { Card } from '@/components/ui/card';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { ForgotForm } from './components/forgot-password-form';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <Card className='p-6'>
                <div className='flex flex-col mb-2 space-y-2 text-left'>
                    <h1 className='font-semibold tracking-tight text-md'>
                        Forgot Password
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Enter your registered email and <br /> we will send you a link to
                        reset your password.
                    </p>
                </div>
                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <ForgotForm />
                <p className='px-8 mt-4 text-sm text-center text-muted-foreground'>
                    Don't have an account?{' '}
                    <Link
                        href={route('register')}
                        className='underline underline-offset-4 hover:text-primary'
                    >
                        Sign up
                    </Link>
                    .
                </p>
            </Card>
        </GuestLayout>
    );
}


