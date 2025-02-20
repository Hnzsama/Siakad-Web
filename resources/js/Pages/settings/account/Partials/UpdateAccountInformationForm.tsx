import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { cn } from "@/lib/utils";
import { UpdateProfileSchema } from "@/Pages/users/data/schema";
import PhoneInput from "@/components/PhoneInput";

export default function UpdateAccountInformation({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const user = usePage().props.auth.user;
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm<UpdateProfileSchema>({
            _method: "PATCH",
            name: user.name,
            email: user.email,
            phone: user.phone ?? '',
            avatar_url: null,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("account.update"));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setData('avatar_url', file);

            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);

            return () => URL.revokeObjectURL(imageUrl);
        }
    };

    return (
        <div className={"space-y-2"}>
            <p className="text-sm text-muted-foreground">
                Perbarui informasi profil dan alamat email akun Anda.
            </p>

            <form onSubmit={submit} className="space-y-5">
                <div className="flex items-center gap-6">
                    <Label htmlFor="avatar" className="sr-only">Avatar</Label>
                    <Avatar className="w-20 h-20">
                        <AvatarImage
                            src={imagePreview || user.avatar_url || undefined}
                            alt="Foto profil"
                            className="object-cover w-full h-full"
                        />
                        <AvatarFallback className="text-xl">
                            {user.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                        <Label
                            htmlFor="avatar"
                            className="text-sm font-medium"
                        >
                            Foto Profil
                        </Label>
                        <Input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name">Nama</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        autoComplete="name"
                        autoFocus
                    />
                    {errors.name && (
                        <span className="text-destructive-foreground">{errors.name}</span>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />
                    {errors.email && (
                        <span className="text-sm text-destructive">{errors.email}</span>
                    )}
                </div>

                <PhoneInput
                    value={data.phone}
                    onChange={(value) => setData('phone', value)}
                    placeholder=""
                    label="Nomor Telepon"
                    error={errors.phone}
                />

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Alamat email Anda belum diverifikasi.{' '}
                            <Button
                                variant="link"
                                className="px-0 text-primary hover:text-primary/90"
                                onClick={(e) => {
                                    e.preventDefault();
                                    fetch(route("verification.send"), {
                                        method: "POST",
                                    });
                                }}
                            >
                                Klik di sini untuk mengirim ulang email verifikasi.
                            </Button>
                        </p>
                        {status === "verification-link-sent" && (
                            <p className="text-sm text-success">
                                Tautan verifikasi baru telah dikirim ke alamat email Anda.
                            </p>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={processing}>
                        Simpan Perubahan
                    </Button>
                    {recentlySuccessful && (
                        <p className="text-sm text-muted-foreground">Disimpan.</p>
                    )}
                </div>
            </form>
        </div>
    );
}
