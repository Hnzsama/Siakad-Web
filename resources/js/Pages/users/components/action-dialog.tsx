import { useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/password-input'
import { FormEventHandler } from 'react'
import { User } from '../data/schema'

type UserForm = {
    name: string
    email: string
    phone: string
    password: string
    password_confirmation: string
    isEdit: boolean
}

interface Props {
    currentRow?: User
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
    const isEdit = !!currentRow
    const { data, setData, processing, errors, reset } = useForm<UserForm>({
        name: currentRow?.name ?? '',
        email: currentRow?.email ?? '',
        phone: currentRow?.phone ?? '',
        password: '',
        password_confirmation: '',
        isEdit,
    })

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault()
        console.log(data)
    }

    return (
        <Dialog open={open} onOpenChange={(state) => {
            reset()
            onOpenChange(state)
        }}>
            <DialogContent className="max-w-md mx-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Update user details' : 'Create new user'}
                    </DialogDescription>
                </DialogHeader>

                <form id="user-form" onSubmit={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="John Doe"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="john@example.com"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="0838-1234-5678"
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-500">{errors.phone}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <PasswordInput
                                id="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Confirm Password</Label>
                            <PasswordInput
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                            {errors.password_confirmation && (
                                <p className="text-sm text-red-500">{errors.password_confirmation}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" className="w-full">
                            {isEdit ? 'Update' : 'Create'} User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
