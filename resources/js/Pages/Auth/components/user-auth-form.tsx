import { FormEventHandler, HTMLAttributes } from 'react'
import { Link, useForm } from '@inertiajs/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react'
import { PasswordInput } from '@/components/password-input'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className={cn('grid gap-6', className)} {...props}>
            <form onSubmit={submit}>
                <div className="grid gap-2">
                    <div className='space-y-1'>
                        <Label htmlFor="email" className="block text-sm font-semibold">
                            Email
                        </Label>
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

                    <div className='space-y-1'>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="block text-sm font-semibold">
                                Password
                            </Label>
                            <Link
                                href="/forgot-password"
                                className="text-sm font-medium text-muted-foreground hover:opacity-75"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="Password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>

                    {/* Remember Me Checkbox */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="remember"
                            checked={data.remember}
                            onCheckedChange={(value) => setData('remember', !!value)}
                        />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>

                    {/* Submit Button */}
                    <Button className="mt-2" disabled={processing}>
                        Login
                    </Button>

                    {/* Or Continue With Section */}
                    {/* <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="px-2 bg-background text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div> */}

                    {/* Social Login Buttons */}
                    {/* <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="w-full"
                            type="button"
                            disabled={processing}
                        >
                            <IconBrandGithub className="w-4 h-4" /> GitHub
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            type="button"
                            disabled={processing}
                        >
                            <IconBrandFacebook className="w-4 h-4" /> Facebook
                        </Button>
                    </div> */}
                </div>
            </form>
        </div>
    );
}
