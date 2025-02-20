import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export default function DeleteUserForm() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setIsDialogOpen(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('account.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setIsDialogOpen(false);
        clearErrors();
        reset();
    };

    return (
        <div className={'space-y-6'}>
            <p className="text-sm text-muted-foreground">
                Setelah akun Anda dihapus, semua sumber daya dan data akan dihapus secara permanen.
                Sebelum menghapus akun, silakan unduh data atau informasi yang ingin Anda simpan.
            </p>

            <Button variant="destructive" onClick={confirmUserDeletion}>
                Hapus Akun
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Apakah Anda yakin ingin menghapus akun Anda?
                        </DialogTitle>
                        <DialogDescription>
                            Setelah akun Anda dihapus, semua sumber daya dan data akan dihapus secara permanen.
                            Silakan masukkan kata sandi Anda untuk mengonfirmasi bahwa Anda ingin menghapus akun secara permanen.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={deleteUser} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Kata Sandi</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Masukkan kata sandi Anda"
                                className="w-full"
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={closeModal} type="button">
                                Batal
                            </Button>
                            <Button variant="destructive" type="submit" disabled={processing}>
                                Hapus Akun
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
