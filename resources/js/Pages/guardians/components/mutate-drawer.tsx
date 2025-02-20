import React, { useState } from 'react'
import { useForm } from '@inertiajs/react'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Search, ChevronRight } from 'lucide-react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Guardian, FormData } from '../data/schema'
import { useResourceContext } from '../context/context'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import PhoneInput from '@/components/PhoneInput'
import DatePickerYear from '@/components/DataPickerYear'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: Guardian
}

export function MutateDrawer({ open, onOpenChange, currentRow }: Props) {
    const isUpdate = !!currentRow
    const { resourceName, mainRoute } = useResourceContext()

    const { data, setData, post, put, errors, processing, reset } = useForm<FormData>({
        name: currentRow?.name ?? "",
        relationship: currentRow?.relationship ?? "Father",
        nik: currentRow?.nik ?? "",
        date_of_birth: currentRow?.date_of_birth ?? new Date().toISOString(),
        address: currentRow?.address ?? "",
        phone: currentRow?.phone ?? "",
        email: currentRow?.email ?? "",
        gender: currentRow?.gender ?? "Male",
        occupation: currentRow?.occupation ?? "",
        income: currentRow?.income ?? '',
        status: currentRow?.status ?? true,
        created_at: currentRow?.created_at ?? new Date().toISOString(),
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
                <form id="roles-form" onSubmit={onSubmit} className="flex flex-col h-full">
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

                                {/* Relationship */}
                                <div className="space-y-2">
                                    <Label htmlFor="relationship">Hubungan</Label>
                                    <Select
                                        value={data.relationship}
                                        onValueChange={(value: "Father" | "Mother" | "Guardian" | "Other") => setData("relationship", value)}
                                    >
                                        <SelectTrigger className={errors.relationship ? "ring-destructive" : ""}>
                                            <SelectValue placeholder="Pilih hubungan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Father">Ayah</SelectItem>
                                            <SelectItem value="Mother">Ibu</SelectItem>
                                            <SelectItem value="Guardian">Wali</SelectItem>
                                            <SelectItem value="Other">Lainnya</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.relationship && <span className="text-sm text-destructive">{errors.relationship}</span>}
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

                                {/* Phone */}
                                <PhoneInput
                                    value={data.phone}
                                    onChange={(value) => setData('phone', value)}
                                    placeholder="Masukkan nomor telepon"
                                    label="Nomor Telepon"
                                    error={errors.phone}
                                />

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
                                {/* Occupation */}
                                <div className="space-y-2">
                                    <Label htmlFor="occupation">Pekerjaan</Label>
                                    <Input
                                        id="occupation"
                                        value={data.occupation ?? ""}
                                        onChange={(e) => setData("occupation", e.target.value)}
                                        placeholder="Masukkan pekerjaan"
                                        className={errors.occupation ? "ring-destructive" : ""}
                                    />
                                    {errors.occupation && <span className="text-sm text-destructive">{errors.occupation}</span>}
                                </div>

                                {/* Income */}
                                <div className="space-y-2">
                                    <Label htmlFor="income">Penghasilan</Label>
                                    <Input
                                        id="income"
                                        type="number"
                                        value={data.income ?? 0}
                                        onChange={(e) => setData("income", e.target.value)}
                                        placeholder="Masukkan penghasilan"
                                        className={errors.income ? "ring-destructive" : ""}
                                    />
                                    {errors.income && <span className="text-sm text-destructive">{errors.income}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Status Switch */}
                        <div className="flex items-center my-6 space-x-2">
                            <Switch
                                id="status"
                                checked={data.status}
                                onCheckedChange={(checked) => setData("status", checked)}
                            />
                            <Label htmlFor="status">Aktif</Label>
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
