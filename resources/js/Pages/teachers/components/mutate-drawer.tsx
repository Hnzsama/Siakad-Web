import React, { useState } from 'react'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Search, ChevronRight } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Teacher, FormData, SelectResponse } from '../data/schema'
import { useResourceContext } from '../context/context'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import DatePickerYear from '@/components/DataPickerYear'
import { ComboboxForm } from '@/components/ComboboxForm'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Teacher
}

export function MutateDrawer({ open, onOpenChange, currentRow }: Props) {
  const isUpdate = !!currentRow
  const { resourceName, mainRoute } = useResourceContext()
  const { shifts } = usePage<SelectResponse>().props

  const { data, setData, post, put, errors, processing, reset } = useForm<FormData>({
    name: currentRow?.name ?? "",
    nip: currentRow?.nip ?? "",
    shift_id: currentRow?.shift_id ?? "",
    gender: currentRow?.gender ?? "Male",
    place_of_birth: currentRow?.place_of_birth ?? "",
    date_of_birth: currentRow?.date_of_birth ?? "", // You might want to set a default date here
    highest_education: currentRow?.highest_education ?? null,
    major: currentRow?.major ?? null,
    university: currentRow?.university ?? null,
    certification: currentRow?.certification ?? null,
    address: currentRow?.address ?? "",
    phone: currentRow?.phone ?? null,
    email: currentRow?.email ?? "",
    position: currentRow?.position ?? null,
    subject: currentRow?.subject ?? null,
    year_started: currentRow?.year_started ?? new Date().getFullYear().toString(),
    year_ended: currentRow?.year_ended ?? null,
    work_experience: currentRow?.work_experience ?? null,
    status: currentRow?.status ?? true,
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
                    maxLength={255}
                  />
                  {errors.name && <span className="text-sm text-destructive">{errors.name}</span>}
                </div>

                {/* NIP */}
                <div className="space-y-2">
                  <Label htmlFor="nip">NIP</Label>
                  <Input
                    id="nip"
                    value={data.nip}
                    onChange={(e) => setData("nip", e.target.value)}
                    placeholder="Masukkan NIP"
                    className={errors.nip ? "ring-destructive" : ""}
                    maxLength={255}
                  />
                  {errors.nip && <span className="text-sm text-destructive">{errors.nip}</span>}
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
                    maxLength={255}
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

                {/* Year Started */}
                <div className="space-y-2">
                  <Label htmlFor="year_started">Tahun Mulai</Label>
                  <Input
                    id="year_started"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={data.year_started}
                    onChange={(e) => setData("year_started", e.target.value)}
                    placeholder="Tahun mulai"
                    className={errors.year_started ? "ring-destructive" : ""}
                  />
                  {errors.year_started && <span className="text-sm text-destructive">{errors.year_started}</span>}
                </div>

                {/* Shift */}
                <ComboboxForm
                  label="Shift"
                  value={data.shift_id}
                  onValueChange={(value) => setData("shift_id", value)}
                  options={shifts.map(shift => ({
                    value: shift.id,
                    label: shift.name
                  }))}
                  placeholder="Pilih Shift"
                  searchPlaceholder="Cari Shift..."
                  emptyMessage="Shift tidak ditemukan."
                  error={!!errors.shift_id}
                  errorMessage={errors.shift_id}
                />
              </div>
            </div>

            {/* Optional Fields Section */}
            <div className="mt-6 space-y-6">
              <h3 className="text-lg font-medium">Informasi Tambahan</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Highest Education */}
                <div className="space-y-2">
                  <Label htmlFor="highest_education">Pendidikan Terakhir</Label>
                  <Input
                    id="highest_education"
                    value={data.highest_education ?? ""}
                    onChange={(e) => setData("highest_education", e.target.value)}
                    placeholder="Masukkan pendidikan terakhir"
                    className={errors.highest_education ? "ring-destructive" : ""}
                    maxLength={255}
                  />
                  {errors.highest_education && (
                    <span className="text-sm text-destructive">{errors.highest_education}</span>
                  )}
                </div>

                {/* Major */}
                <div className="space-y-2">
                  <Label htmlFor="major">Jurusan</Label>
                  <Input
                    id="major"
                    value={data.major ?? ""}
                    onChange={(e) => setData("major", e.target.value)}
                    placeholder="Masukkan jurusan"
                    className={errors.major ? "ring-destructive" : ""}
                    maxLength={255}
                  />
                  {errors.major && <span className="text-sm text-destructive">{errors.major}</span>}
                </div>

                {/* University */}
                <div className="space-y-2">
                  <Label htmlFor="university">Universitas</Label>
                  <Input
                    id="university"
                    value={data.university ?? ""}
                    onChange={(e) => setData("university", e.target.value)}
                    placeholder="Masukkan universitas"
                    className={errors.university ? "ring-destructive" : ""}
                    maxLength={255}
                  />
                  {errors.university && <span className="text-sm text-destructive">{errors.university}</span>}
                </div>

                {/* Certification */}
                <div className="space-y-2">
                  <Label htmlFor="certification">Sertifikasi</Label>
                  <Input
                    id="certification"
                    value={data.certification ?? ""}
                    onChange={(e) => setData("certification", e.target.value)}
                    placeholder="Masukkan sertifikasi"
                    className={errors.certification ? "ring-destructive" : ""}
                    maxLength={255}
                  />
                  {errors.certification && (
                    <span className="text-sm text-destructive">{errors.certification}</span>
                  )}
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <Label htmlFor="position">Jabatan</Label>
                  <Input
                    id="position"
                    value={data.position ?? ""}
                    onChange={(e) => setData("position", e.target.value)}
                    placeholder="Masukkan jabatan"
                    className={errors.position ? "ring-destructive" : ""}
                    maxLength={255}
                  />
                  {errors.position && <span className="text-sm text-destructive">{errors.position}</span>}
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Mata Pelajaran</Label>
                  <Input
                    id="subject"
                    value={data.subject ?? ""}
                    onChange={(e) => setData("subject", e.target.value)}
                    placeholder="Masukkan mata pelajaran"
                    className={errors.subject ? "ring-destructive" : ""}
                    maxLength={255}
                  />
                  {errors.subject && <span className="text-sm text-destructive">{errors.subject}</span>}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    value={data.phone ?? ""}
                    onChange={(e) => setData("phone", e.target.value)}
                    placeholder="Masukkan nomor telepon"
                    className={errors.phone ? "ring-destructive" : ""}
                    maxLength={255}
                  />
                  {errors.phone && <span className="text-sm text-destructive">{errors.phone}</span>}
                </div>

                {/* Year Ended (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="year_ended">Tahun Selesai</Label>
                  <Input
                    id="year_ended"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={data.year_ended ?? ""}
                    onChange={(e) => setData("year_ended", e.target.value)}
                    placeholder="Tahun selesai"
                    className={errors.year_ended ? "ring-destructive" : ""}
                  />
                  {errors.year_ended && <span className="text-sm text-destructive">{errors.year_ended}</span>}
                </div>

                {/* Work Experience */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="work_experience">Pengalaman Kerja</Label>
                  <Textarea
                    id="work_experience"
                    value={data.work_experience ?? ""}
                    onChange={(e) => setData("work_experience", e.target.value)}
                    placeholder="Masukkan pengalaman kerja"
                    className={`w-full p-2 border rounded ${errors.work_experience ? "ring-destructive" : ""}`}
                  />
                  {errors.work_experience && (
                    <span className="text-sm text-destructive">{errors.work_experience}</span>
                  )}
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
              <Label htmlFor="status">{data.status ? 'Aktif' : 'Tidak Aktif'}</Label>
            </div>

          </div>
          {/* Footer */}
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
