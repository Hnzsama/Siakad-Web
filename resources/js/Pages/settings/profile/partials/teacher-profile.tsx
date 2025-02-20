import { FormProfile, Teacher } from "@/Pages/teachers/data/schema"
import { toast } from '@/hooks/use-toast'
import { useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PhoneInput from "@/components/PhoneInput"
import DatePickerYear from "@/components/DataPickerYear"

export default function TeacherProfile({
    teacher
}: {
    teacher: Teacher
}) {
    const { data, setData, put, errors, processing, reset } = useForm<FormProfile>({
        name: teacher?.name ?? "",
        nip: teacher?.nip ?? "",
        gender: teacher?.gender ?? "Male",
        place_of_birth: teacher?.place_of_birth ?? "",
        date_of_birth: teacher?.date_of_birth ?? new Date().toISOString(),
        highest_education: teacher?.highest_education ?? "",
        major: teacher?.major ?? "",
        university: teacher?.university ?? "",
        certification: teacher?.certification ?? "",
        address: teacher?.address ?? "",
        phone: teacher?.phone ?? "",
        email: teacher?.email ?? "",
        position: teacher?.position ?? "",
        subject: teacher?.subject ?? "",
        year_started: teacher?.year_started ?? new Date().getFullYear().toString(),
        year_ended: teacher?.year_ended ?? "",
        work_experience: teacher?.work_experience ?? "",
        status: teacher?.status ?? true
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

        put(route(`profile.update`, { id: teacher.id }), options)
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
                            <Label htmlFor="nip">NIP</Label>
                            <Input
                                id="nip"
                                value={data.nip}
                                onChange={(e) => setData('nip', e.target.value)}
                                placeholder="Masukkan NIP"
                            />
                            {errors.nip && (
                                <span className="text-sm text-destructive">{errors.nip}</span>
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
                </div>

                {/* Education Information */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium">Riwayat Pendidikan</h3>
                        <p className="text-sm text-muted-foreground">
                            Informasi pendidikan terakhir.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="highest_education">Pendidikan Terakhir</Label>
                            <Input
                                id="highest_education"
                                value={data.highest_education ?? ""}
                                onChange={(e) => setData('highest_education', e.target.value)}
                                placeholder="Masukkan pendidikan terakhir"
                            />
                            {errors.highest_education && (
                                <span className="text-sm text-destructive">{errors.highest_education}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="major">Jurusan</Label>
                            <Input
                                id="major"
                                value={data.major ?? ""}
                                onChange={(e) => setData('major', e.target.value)}
                                placeholder="Masukkan jurusan"
                            />
                            {errors.major && (
                                <span className="text-sm text-destructive">{errors.major}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="university">Universitas</Label>
                            <Input
                                id="university"
                                value={data.university ?? ""}
                                onChange={(e) => setData('university', e.target.value)}
                                placeholder="Masukkan universitas"
                            />
                            {errors.university && (
                                <span className="text-sm text-destructive">{errors.university}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="certification">Sertifikasi</Label>
                            <Input
                                id="certification"
                                value={data.certification ?? ""}
                                onChange={(e) => setData('certification', e.target.value)}
                                placeholder="Masukkan sertifikasi"
                            />
                            {errors.certification && (
                                <span className="text-sm text-destructive">{errors.certification}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Employment Information */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium">Informasi Kepegawaian</h3>
                        <p className="text-sm text-muted-foreground">
                            Informasi pekerjaan dan pengalaman.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="position">Jabatan</Label>
                            <Input
                                id="position"
                                value={data.position ?? ""}
                                onChange={(e) => setData('position', e.target.value)}
                                placeholder="Masukkan jabatan"
                            />
                            {errors.position && (
                                <span className="text-sm text-destructive">{errors.position}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Mata Pelajaran</Label>
                            <Input
                                id="subject"
                                value={data.subject ?? ""}
                                onChange={(e) => setData('subject', e.target.value)}
                                placeholder="Masukkan mata pelajaran"
                            />
                            {errors.subject && (
                                <span className="text-sm text-destructive">{errors.subject}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="year_started">Tahun Masuk</Label>
                            <Input
                                id="year_started"
                                value={data.year_started}
                                onChange={(e) => setData('year_started', e.target.value)}
                                placeholder="Masukkan tahun masuk"
                            />
                            {errors.year_started && (
                                <span className="text-sm text-destructive">{errors.year_started}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="work_experience">Pengalaman Kerja</Label>
                            <Input
                                id="work_experience"
                                value={data.work_experience ?? ""}
                                onChange={(e) => setData('work_experience', e.target.value)}
                                placeholder="Masukkan pengalaman kerja"
                            />
                            {errors.work_experience && (
                                <span className="text-sm text-destructive">{errors.work_experience}</span>
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
