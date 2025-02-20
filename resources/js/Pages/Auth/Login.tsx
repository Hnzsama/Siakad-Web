import Checkbox from '@/components/Checkbox';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { UserAuthForm } from './components/user-auth-form';
import { Card } from '@/components/ui/card';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    return (
        <GuestLayout>
            <Head title="Log in" />

            <Card className='p-6'>
                <div className='flex flex-col mb-2 space-y-2 text-left'>
                    <h1 className='text-2xl font-semibold tracking-tight'>Login</h1>
                    <p className='text-sm text-muted-foreground'>
                        Enter your email and password below <br />
                        to log into your account
                    </p>
                    <p className='text-sm text-muted-foreground'>
                        Don{"'"}t have an account?{' '}
                        <Link
                            href={route('register')}
                            className='underline underline-offset-4 hover:text-primary'
                        >
                            Sign up
                        </Link>
                    </p>
                </div>

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <UserAuthForm />
                <p className='px-8 mt-4 text-sm text-center text-muted-foreground'>
                    By clicking login, you agree to our{' '}
                    <a
                        href='/terms'
                        className='underline underline-offset-4 hover:text-primary'
                    >
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a
                        href='/privacy'
                        className='underline underline-offset-4 hover:text-primary'
                    >
                        Privacy Policy
                    </a>
                    .
                </p>
            </Card>
        </GuestLayout>
    );
}
