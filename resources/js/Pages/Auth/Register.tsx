import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import { Card } from '@/components/ui/card';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { SignUpForm } from './components/sign-up-form';

export default function Register() {
    return (
        <>
            <GuestLayout>
                <Head title="Register" />
                <Card className='p-6'>
                    <div className='flex flex-col mb-2 space-y-2 text-left'>
                        <h1 className='text-lg font-semibold tracking-tight'>
                            Create an account
                        </h1>
                        <p className='text-sm text-muted-foreground'>
                            Enter your email and password to create an account. <br />
                            Already have an account?{' '}
                            <Link
                                href={route('login')}
                                className='underline underline-offset-4 hover:text-primary'
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                    <SignUpForm />
                    <p className='px-8 mt-4 text-sm text-center text-muted-foreground'>
                        By creating an account, you agree to our{' '}
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
        </>
    );
}
