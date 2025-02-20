import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Link, router } from '@inertiajs/react'
import { Button } from './ui/button'

interface LogoutDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const LogoutDialog: React.FC<LogoutDialogProps> = ({
    open,
    onOpenChange,
}) => {
    function handleLogout() {
        router.post(route('logout'));
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Anda yakin ingin keluar?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Anda akan keluar dari akun Anda dan diarahkan ke halaman utama.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batalkan</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                            Keluar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

