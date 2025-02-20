import { FormEventHandler, HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from '@inertiajs/react'
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { Label } from '@/components/ui/label'

type SignUpFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z
    .object({
        email: z
            .string()
            .min(1, { message: 'Please enter your email' })
            .email({ message: 'Invalid email address' }),
        password: z
            .string()
            .min(1, {
                message: 'Please enter your password',
            })
            .min(7, {
                message: 'Password must be at least 7 characters long',
            }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match.",
        path: ['confirmPassword'],
    })

export function SignUpForm({ className, ...props }: SignUpFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className={cn('grid gap-6', className)} {...props}>
            <form onSubmit={submit}>
                <div className='grid gap-2'>
                    <div className='space-y-1'>
                        <Label htmlFor='name' className='block text-sm font-semibold'>Name</Label>
                        <div>
                            <Input
                                id='name'
                                type='name'
                                name='name'
                                value={data.name}
                                placeholder='name@example.com'
                                onChange={(e) => setData('name', e.target.value)}
                            />
                        </div>
                        {errors.name && (
                            <p className="text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>
                    <div className='space-y-1'>
                        <Label htmlFor='email' className='block text-sm font-semibold'>Email</Label>
                        <div>
                            <Input
                                id='email'
                                type='email'
                                name='email'
                                value={data.email}
                                placeholder='name@example.com'
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
                                placeholder='Password'
                                value={data.password}
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
                                placeholder='Password'
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                        </div>
                        {errors.password_confirmation && (
                            <p className="text-sm text-red-600">{errors.password_confirmation}</p>
                        )}
                    </div>
                    <Button className='mt-2' disabled={processing}>
                        Create Account
                    </Button>

                    {/* <div className='relative my-2'>
                        <div className='absolute inset-0 flex items-center'>
                            <span className='w-full border-t' />
                        </div>
                        <div className='relative flex justify-center text-xs uppercase'>
                            <span className='px-2 bg-background text-muted-foreground'>
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <Button
                            variant='outline'
                            className='w-full'
                            type='button'
                            disabled={processing}
                        >
                            <IconBrandGithub className='w-4 h-4' /> GitHub
                        </Button>
                        <Button
                            variant='outline'
                            className='w-full'
                            type='button'
                            disabled={processing}
                        >
                            <IconBrandFacebook className='w-4 h-4' /> Facebook
                        </Button>
                    </div> */}
                </div>
            </form>
        </div>
    )
}
