import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useRef } from "react";
import { cn } from "@/lib/utils";
import { UpdatePasswordSchema } from "@/Pages/users/data/schema";
import { PasswordInput } from "@/components/password-input";

export default function UpdatePasswordForm() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm<UpdatePasswordSchema>({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route("account.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <form onSubmit={updatePassword} className={"space-y-4"}>
            <p className="text-sm text-muted-foreground">
                Pastikan akun Anda menggunakan kata sandi yang panjang dan acak untuk tetap aman.
            </p>

            <div className="space-y-2">
                <Label htmlFor="current_password">Kata Sandi Saat Ini</Label>
                <PasswordInput
                    id="current_password"
                    ref={currentPasswordInput}
                    value={data.current_password}
                    onChange={(e) => setData("current_password", e.target.value)}
                    autoComplete="current-password"
                />
                {errors.current_password && (
                    <Alert variant="destructive">
                        <AlertDescription>
                            {errors.current_password}
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Kata Sandi Baru</Label>
                <PasswordInput
                    id="password"
                    ref={passwordInput}
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    autoComplete="new-password"
                />
                {errors.password && (
                    <Alert variant="destructive">
                        <AlertDescription>
                            {errors.password}
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi</Label>
                <PasswordInput
                    id="password_confirmation"
                    value={data.password_confirmation}
                    onChange={(e) => setData("password_confirmation", e.target.value)}
                    autoComplete="new-password"
                />
                {errors.password_confirmation && (
                    <Alert variant="destructive">
                        <AlertDescription>
                            {errors.password_confirmation}
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            <div className="flex items-center gap-4">
                <Button type="submit" disabled={processing}>
                    Simpan Perubahan
                </Button>
                {recentlySuccessful && (
                    <p className="text-sm text-muted-foreground">Tersimpan.</p>
                )}
            </div>
        </form>
    );
}
