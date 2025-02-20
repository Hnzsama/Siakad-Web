import { FormData, FormProfile, Student } from "@/Pages/students/data/schema"
import { toast } from '@/hooks/use-toast'
import { router, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PhoneInput from "@/components/PhoneInput"
import DatePickerYear from "@/components/DataPickerYear"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StudentProfile({
    student
}: {
    student: Student
}) {
    const { data, setData, put, errors, processing, reset } = useForm<FormProfile>({
        name: student?.name ?? "",
        nik: student?.nik ?? "",
        gender: student?.gender ?? "Male",
        place_of_birth: student?.place_of_birth ?? "",
        date_of_birth: student?.date_of_birth ?? new Date().toISOString(),
        address: student?.address ?? "",
        phone: student?.phone ?? "",
        email: student?.email ?? "",
        status: student?.status ?? 'Active'
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        console.log(data)

        const options = {
            preserveScroll: true,
            onError: (errors: any) => {
                console.error('Error:', errors);
                toast({
                    variant: "destructive",
                    title: `Gagal menyimpan perbaruan profil`,
                    description: "Silakan periksa kembali form anda"
                })
            },
            onSuccess: (response: any) => {
                console.log('Success:', response);
                toast({
                    title: `Profil berhasil diperbarui`,
                    description: `Profil telah berhasil diperbarui dalam sistem`
                })
            },
        }

        put(route(`profile.update`, { id: student.id }), options)
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium">Informasi Pribadi</h3>
                        <p className="text-sm text-muted-foreground">
                            Perbarui informasi pribadi dan alamat Anda.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Masukkan nama lengkap"
                            />
                            {errors.name && (
                                <span className="text-sm text-destructive">{errors.name}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nik">NIK</Label>
                            <Input
                                id="nik"
                                value={data.nik}
                                onChange={(e) => setData('nik', e.target.value)}
                                placeholder="Masukkan NIK"
                                maxLength={16}
                            />
                            {errors.nik && (
                                <span className="text-sm text-destructive">{errors.nik}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gender">Jenis Kelamin</Label>
                            <Select
                                value={data.gender}
                                onValueChange={(value: "Male" | "Female") =>
                                    setData('gender', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih jenis kelamin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Laki-laki</SelectItem>
                                    <SelectItem value="Female">Perempuan</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.gender && (
                                <span className="text-sm text-destructive">{errors.gender}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="place_of_birth">Tempat Lahir</Label>
                            <Input
                                id="place_of_birth"
                                value={data.place_of_birth}
                                onChange={(e) => setData('place_of_birth', e.target.value)}
                                placeholder="Masukkan tempat lahir"
                            />
                            {errors.place_of_birth && (
                                <span className="text-sm text-destructive">{errors.place_of_birth}</span>
                            )}
                        </div>

                        <DatePickerYear
                            id="date_of_birth"
                            label="Tanggal Lahir"
                            value={data.date_of_birth}
                            onChange={(date) => setData('date_of_birth', date)}
                            error={errors.date_of_birth}
                        />

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Alamat</Label>
                            <Input
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Masukkan alamat lengkap"
                            />
                            {errors.address && (
                                <span className="text-sm text-destructive">{errors.address}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium">Informasi Kontak</h3>
                        <p className="text-sm text-muted-foreground">
                            Perbarui informasi kontak Anda.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Masukkan email"
                            />
                            {errors.email && (
                                <span className="text-sm text-destructive">{errors.email}</span>
                            )}
                        </div>

                        <PhoneInput
                            value={data.phone ?? ""}
                            onChange={(value) => setData('phone', value)}
                            label="Nomor Telepon"
                            placeholder="Masukkan nomor telepon"
                            error={errors.phone}
                        />
                    </div>

                    <div className="hidden space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Input
                            id="status"
                            value={data.status === 'Active' ? 'Aktif' :
                                data.status === 'Graduated' ? 'Lulus' :
                                    data.status === 'Dropped Out' ? 'Keluar' : data.status}
                            readOnly
                            disabled
                        />
                        <input
                            type="hidden"
                            name="status"
                            value={data.status}
                        />
                        {errors.status && (
                            <span className="text-sm text-destructive">{errors.status}</span>
                        )}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={processing}
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </div>
            </div>
        </form>
    )
}
