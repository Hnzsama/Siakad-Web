import { FormEventHandler, HTMLAttributes } from 'react'
import { useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type ResetPasswordFormProps = HTMLAttributes<HTMLDivElement> & {
    token: string;
    email: string;
}

export function ResetPasswordForm({ className, token, email, ...props }: ResetPasswordFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className={cn('grid gap-6', className)} {...props}>
            <form onSubmit={submit}>
                <div className='grid gap-2'>
                    <div className='space-y-1'>
                        <Label htmlFor='email' className='block text-sm font-semibold'>Email</Label>
                        <div>
                            <Input
                                id='email'
                                type='email'
                                name='email'
                                value={data.email}
                                className="block w-full mt-1"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>
                    <div className='space-y-1'>
                        <Label htmlFor='password' className='block text-sm font-semibold'>Password</Label>
                        <div>
                            <PasswordInput
                                id='password'
                                name='password'
                                value={data.password}
                                className="block w-full mt-1"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>
                    <div className='space-y-1'>
                        <Label htmlFor='password_confirmation' className='block text-sm font-semibold'>Confirm Password</Label>
                        <div>
                            <PasswordInput
                                id='password_confirmation'
                                name='password_confirmation'
                                value={data.password_confirmation}
                                className="block w-full mt-1"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                        </div>
                        {errors.password_confirmation && (
                            <p className="text-sm text-red-600">{errors.password_confirmation}</p>
                        )}
                    </div>
                    <Button className='mt-4' disabled={processing}>
                        Reset Password
                    </Button>
                </div>
            </form>
        </div>
    )
}
