import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi Email" />

            <Card className="p-6">
                <div className="flex flex-col mb-2 space-y-2 text-left">
                    <h1 className="font-semibold tracking-tight text-md">
                        Verifikasi Email
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Terima kasih telah mendaftar! Sebelum memulai, harap verifikasi alamat email Anda dengan mengklik tautan yang baru saja kami kirimkan. <br />
                        Jika Anda tidak menerima email tersebut, Anda dapat meminta yang baru di bawah ini.
                    </p>
                </div>

                {status === 'verification-link-sent' && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        Tautan verifikasi baru telah dikirim ke alamat email yang Anda berikan saat pendaftaran.
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <Button type="submit" disabled={processing} className="w-full">
                        Kirim Ulang Email Verifikasi
                    </Button>
                </form>

                <p className="px-8 mt-4 text-sm text-center text-muted-foreground">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Log out

                    </Link>
                </p>
            </Card>
        </GuestLayout>
    );
}

