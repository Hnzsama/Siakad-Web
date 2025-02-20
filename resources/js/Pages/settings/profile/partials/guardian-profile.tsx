import { FormProfile, Guardian } from "@/Pages/guardians/data/schema"
import { useForm } from "@inertiajs/react"
import { toast } from '@/hooks/use-toast'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PhoneInput from "@/components/PhoneInput"
import DatePickerYear from "@/components/DataPickerYear"

export default function GuardianProfile({
    guardian
}: {
    guardian: Guardian
}) {
    const { data, setData, put, errors, processing, reset } = useForm<FormProfile>({
        name: guardian?.name ?? "",
        relationship: guardian?.relationship ?? "Father",
        nik: guardian?.nik ?? "",
        date_of_birth: guardian?.date_of_birth ?? new Date().toISOString(),
        address: guardian?.address ?? "",
        phone: guardian?.phone ?? "",
        email: guardian?.email ?? "",
        gender: guardian?.gender ?? "Male",
        occupation: guardian?.occupation ?? "",
        income: guardian?.income ?? '',
        status: guardian?.status ?? true,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const options = {
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
            preserveScroll: true
        }

        put(route(`profile.update`, { id: guardian.id }), options)
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
                            <Label htmlFor="relationship">Hubungan</Label>
                            <Select
                                value={data.relationship}
                                onValueChange={(value: "Father" | "Mother" | "Guardian" | "Other") =>
                                    setData('relationship', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih hubungan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Father">Ayah</SelectItem>
                                    <SelectItem value="Mother">Ibu</SelectItem>
                                    <SelectItem value="Guardian">Wali</SelectItem>
                                    <SelectItem value="Other">Lainnya</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.relationship && (
                                <span className="text-sm text-destructive">{errors.relationship}</span>
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
                            value={data.phone}
                            onChange={(value) => setData('phone', value)}
                            label="Nomor Telepon"
                            placeholder="Masukkan nomor telepon"
                            error={errors.phone}
                        />
                    </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium">Informasi Tambahan</h3>
                        <p className="text-sm text-muted-foreground">
                            Informasi pekerjaan dan penghasilan.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="occupation">Pekerjaan</Label>
                            <Input
                                id="occupation"
                                value={data.occupation ?? ''}
                                onChange={(e) => setData('occupation', e.target.value)}
                                placeholder="Masukkan pekerjaan"
                            />
                            {errors.occupation && (
                                <span className="text-sm text-destructive">{errors.occupation}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="income">Penghasilan</Label>
                            <Input
                                id="income"
                                value={data.income ?? ''}
                                onChange={(e) => setData('income', e.target.value)}
                                placeholder="Masukkan penghasilan"
                            />
                            {errors.income && (
                                <span className="text-sm text-destructive">{errors.income}</span>
                            )}
                        </div>
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
