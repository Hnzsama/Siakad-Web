import { FormEventHandler, HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from '@inertiajs/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type ForgotFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Please enter your email' })
        .email({ message: 'Invalid email address' }),
})

export function ForgotForm({ className, ...props }: ForgotFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        resolver: zodResolver(formSchema),
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className={cn('grid gap-6', className)} {...props}>
            <form onSubmit={submit} className="grid gap-2">
                <div className="space-y-1">
                    <Label htmlFor="email" className="block text-sm font-medium">Email</Label>
                    <div>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-sm text-red-600">{errors.email}</p>
                    )}
                </div>
                <Button className="mt-2" disabled={processing}>
                    Continue
                </Button>
            </form>
        </div>
    );
}
