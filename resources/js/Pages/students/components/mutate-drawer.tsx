import React from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Student, FormData, SelectResponse } from '../data/schema'
import { useResourceContext } from '../context/context'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import PhoneInput from '@/components/PhoneInput'
import DatePickerYear from '@/components/DataPickerYear'
import { ComboboxForm } from '@/components/ComboboxForm'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: Student
}

export function MutateDrawer({ open, onOpenChange, currentRow }: Props) {
    const isUpdate = !!currentRow
    const { resourceName, mainRoute } = useResourceContext()
    const { classrooms, guardians, semesters } = usePage<SelectResponse>().props

    const { data, setData, post, put, errors, processing, reset } = useForm<FormData>({
        semester_id: currentRow?.semester_id ?? "",
        guardian_id: currentRow?.guardian_id ?? "",
        classroom_id: currentRow?.classroom_id ?? "",
        name: currentRow?.name ?? "",
        nik: currentRow?.nik ?? "",
        nis: currentRow?.nis ?? "",
        gender: currentRow?.gender ?? "Male",
        place_of_birth: currentRow?.place_of_birth ?? "",
        date_of_birth: currentRow?.date_of_birth ?? new Date().toISOString(),
        address: currentRow?.address ?? "",
        phone: currentRow?.phone ?? "",
        email: currentRow?.email ?? "",
        status: currentRow?.status ?? "Active",
        enrollment_date: currentRow?.enrollment_date ?? new Date().toISOString(),
        graduation_date: currentRow?.graduation_date ?? null,
        violation_points: currentRow?.violation_points ?? 100
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const options = {
            onError: (errors: any) => {
                console.error('Error:', errors);
                toast({
                    variant: "destructive",
                    title: `Gagal menyimpan ${resourceName}`,
                    description: "Silakan periksa kembali form anda"
                })
            },
            onSuccess: (response: any) => {
                console.log('Success:', response);
                onOpenChange(false)
                reset()
                toast({
                    title: isUpdate ? `${resourceName} berhasil diperbarui` : `${resourceName} berhasil disimpan`,
                    description: isUpdate
                        ? `${resourceName} telah berhasil diperbarui dalam sistem`
                        : `${resourceName} telah berhasil ditambahkan ke sistem`
                })
            },
            preserveScroll: true
        }

        if (isUpdate && currentRow?.id) {
            put(route(`${mainRoute}.update`, { id: currentRow.id }), options)
        } else {
            post(route(`${mainRoute}.store`), options)
        }
    }

    return (
        <Sheet open={open} onOpenChange={(v) => {
            onOpenChange(v)
            if (!v) {
                reset()
            }
        }}>
            <SheetContent className="flex flex-col w-full h-full p-0 sm:max-w-xl">
                <form id="student-form" onSubmit={onSubmit} className="flex flex-col h-full">
                    <div className="p-6">
                        <SheetHeader className="space-y-2 text-left">
                            <SheetTitle>{isUpdate ? 'Update' : 'Tambah'} {resourceName}</SheetTitle>
                            <SheetDescription>
                                {isUpdate
                                    ? `Update ${resourceName.toLocaleLowerCase()} dengan mengisi informasi yang diperlukan.`
                                    : `Tambah ${resourceName.toLocaleLowerCase()} baru dengan mengisi informasi yang diperlukan.`}
                            </SheetDescription>
                        </SheetHeader>
                    </div>

                    <div className="flex-1 px-6 overflow-y-auto">
                        {/* Required Fields Section */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">Informasi Wajib</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        placeholder="Masukkan nama"
                                        className={errors.name ? "ring-destructive" : ""}
                                    />
                                    {errors.name && <span className="text-sm text-destructive">{errors.name}</span>}
                                </div>

                                {/* NIK */}
                                <div className="space-y-2">
                                    <Label htmlFor="nik">NIK</Label>
                                    <Input
                                        id="nik"
                                        value={data.nik}
                                        onChange={(e) => setData("nik", e.target.value)}
                                        placeholder="Masukkan NIK"
                                        maxLength={16}
                                        className={errors.nik ? "ring-destructive" : ""}
                                    />
                                    {errors.nik && <span className="text-sm text-destructive">{errors.nik}</span>}
                                </div>

                                {/* NIS */}
                                <div className="space-y-2">
                                    <Label htmlFor="nis">NIS</Label>
                                    <Input
                                        id="nis"
                                        value={data.nis}
                                        onChange={(e) => setData("nis", e.target.value)}
                                        placeholder="Masukkan NIS"
                                        className={errors.nis ? "ring-destructive" : ""}
                                    />
                                    {errors.nis && <span className="text-sm text-destructive">{errors.nis}</span>}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                        placeholder="Masukkan email"
                                        className={errors.email ? "ring-destructive" : ""}
                                    />
                                    {errors.email && <span className="text-sm text-destructive">{errors.email}</span>}
                                </div>

                                {/* Place of Birth */}
                                <div className="space-y-2">
                                    <Label htmlFor="place_of_birth">Tempat Lahir</Label>
                                    <Input
                                        id="place_of_birth"
                                        value={data.place_of_birth}
                                        onChange={(e) => setData("place_of_birth", e.target.value)}
                                        placeholder="Masukkan tempat lahir"
                                        className={errors.place_of_birth ? "ring-destructive" : ""}
                                    />
                                    {errors.place_of_birth && <span className="text-sm text-destructive">{errors.place_of_birth}</span>}
                                </div>

                                {/* Date of Birth */}
                                <DatePickerYear
                                    id="date_of_birth"
                                    label="Tanggal Lahir"
                                    value={data.date_of_birth}
                                    onChange={(date) => setData("date_of_birth", date)}
                                    error={errors.date_of_birth}
                                />

                                {/* Gender */}
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Jenis Kelamin</Label>
                                    <Select
                                        value={data.gender}
                                        onValueChange={(value: "Male" | "Female") => setData("gender", value)}
                                    >
                                        <SelectTrigger className={errors.gender ? "ring-destructive" : ""}>
                                            <SelectValue placeholder="Pilih jenis kelamin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Laki-laki</SelectItem>
                                            <SelectItem value="Female">Perempuan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.gender && <span className="text-sm text-destructive">{errors.gender}</span>}
                                </div>

                                {/* Guardian ID */}
                                <ComboboxForm
                                    label="Orang Tua"
                                    value={data.guardian_id ?? ""}
                                    onValueChange={(value) => setData("guardian_id", value)}
                                    options={guardians.map(guardian => ({
                                        value: guardian.id,
                                        label: guardian.name
                                    }))}
                                    placeholder="Pilih Orang Tua"
                                    searchPlaceholder="Cari Orang Tua..."
                                    emptyMessage="Orang Tua tidak ditemukan."
                                    error={!!errors.guardian_id}
                                    errorMessage={errors.guardian_id}
                                />

                                {/* Classroom ID */}
                                <ComboboxForm
                                    label="Kelas"
                                    value={data.classroom_id ?? ""}
                                    onValueChange={(value) => setData("classroom_id", value)}
                                    options={classrooms.map(classroom => ({
                                        value: classroom.id,
                                        label: classroom.name ?? ""
                                    }))}
                                    placeholder="Pilih Kelas"
                                    searchPlaceholder="Cari Kelas..."
                                    emptyMessage="Kelas tidak ditemukan."
                                    error={!!errors.classroom_id}
                                    errorMessage={errors.classroom_id}
                                />

                                {/* Status */}
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value: "Active" | "Graduated" | "Dropped Out") => setData("status", value)}
                                    >
                                        <SelectTrigger className={errors.status ? "ring-destructive" : ""}>
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Aktif</SelectItem>
                                            <SelectItem value="Graduated">Lulus</SelectItem>
                                            <SelectItem value="Dropped Out">Keluar</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <span className="text-sm text-destructive">{errors.status}</span>}
                                </div>

                                {/* Enrollment Date */}
                                <DatePickerYear
                                    id="enrollment_date"
                                    label="Tanggal Masuk"
                                    value={data.enrollment_date}
                                    onChange={(date) => setData("enrollment_date", date)}
                                    error={errors.enrollment_date}
                                />

                                {/* Address */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="address">Alamat</Label>
                                    <Input
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData("address", e.target.value)}
                                        placeholder="Masukkan alamat"
                                        className={errors.address ? "ring-destructive" : ""}
                                    />
                                    {errors.address && <span className="text-sm text-destructive">{errors.address}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Optional Fields Section */}
                        <div className="mt-6 space-y-6">
                            <h3 className="text-lg font-medium">Informasi Tambahan</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Phone */}
                                <PhoneInput
                                    value={data.phone ?? ""}
                                    onChange={(value) => setData('phone', value)}
                                    placeholder="Masukkan nomor telepon"
                                    label="Nomor Telepon"
                                    error={errors.phone}
                                />

                                {/* Graduation Date */}
                                <DatePickerYear
                                    id="graduation_date"
                                    label="Tanggal Lulus"
                                    value={data.graduation_date ?? ""}
                                    onChange={(date) => setData("graduation_date", date)}
                                    error={errors.graduation_date}
                                />

                                {/* Violation Points */}
                                <div className="space-y-2">
                                    <Label htmlFor="violation_points">Poin Pelanggaran</Label>
                                    <Input
                                        id="violation_points"
                                        type="number"
                                        value={data.violation_points}
                                        onChange={(e) => setData("violation_points", Number(e.target.value))}
                                        placeholder="Masukkan poin pelanggaran"
                                        className={errors.violation_points ? "ring-destructive" : ""}
                                    />
                                    {errors.violation_points && <span className="text-sm text-destructive">{errors.violation_points}</span>}
                                </div>

                                {/* Semester ID */}
                                <ComboboxForm
                                    label="Semester"
                                    value={data.semester_id ?? ""}
                                    onValueChange={(value) => setData("semester_id", value)}
                                    options={semesters.map(semester => ({
                                        value: semester.id,
                                        label: semester.name
                                    }))}
                                    placeholder="Pilih Semester"
                                    searchPlaceholder="Cari Semester..."
                                    emptyMessage="Semester tidak ditemukan."
                                    error={!!errors.semester_id}
                                    errorMessage={errors.semester_id}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <SheetFooter className="flex-shrink-0 gap-2">
                            <SheetClose asChild>
                                <Button variant="outline">Tutup</Button>
                            </SheetClose>
                            <Button type="submit" disabled={processing}>
                                {processing ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </SheetFooter>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    )
}
