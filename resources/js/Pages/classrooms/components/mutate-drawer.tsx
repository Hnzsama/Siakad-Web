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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Classroom, FormData, SelectResponse } from '../data/schema'
import { useResourceContext } from '../context/context'
import { Loader2 } from 'lucide-react'
import { ComboboxForm } from '@/components/ComboboxForm'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Classroom
}

export function MutateDrawer({ open, onOpenChange, currentRow }: Props) {
  const isUpdate = !!currentRow
  const { resourceName, mainRoute } = useResourceContext()
  const { teachers, classLevels, studyGroups, shifts, majors } = usePage<SelectResponse>().props

  const { data, setData, post, put, errors, processing, reset } = useForm<FormData>({
    teacher_id: currentRow?.teacher_id ?? "",
    class_level_id: currentRow?.class_level_id ?? "",
    study_group_id: currentRow?.study_group_id ?? "",
    shift_id: currentRow?.shift_id ?? "",
    major_id: currentRow?.major_id ?? "",
    room_number: currentRow?.room_number ?? "",
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
                {/* Teacher */}
                <ComboboxForm
                  label="Wali Kelas"
                  value={data.teacher_id ?? ""}
                  onValueChange={(value) => setData("teacher_id", value)}
                  options={teachers.map(teacher => ({
                    value: teacher.id,
                    label: teacher.name
                  }))}
                  placeholder="Pilih guru"
                  searchPlaceholder="Cari guru..."
                  emptyMessage="Guru tidak ditemukan."
                  error={!!errors.teacher_id}
                  errorMessage={errors.teacher_id}
                />

                {/* Class Level */}
                <div className="space-y-2">
                  <Label htmlFor="class_level_id">Tingkat Kelas</Label>
                  <Select
                    value={data.class_level_id}
                    onValueChange={(value) => setData("class_level_id", value)}
                  >
                    <SelectTrigger className={errors.class_level_id ? "ring-destructive" : ""}>
                      <SelectValue placeholder="Pilih tingkat kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {classLevels?.map((level) => (
                        <SelectItem key={level.id} value={level.id}>
                          {level.alphabet}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.class_level_id && <span className="text-sm text-destructive">{errors.class_level_id}</span>}
                </div>

                {/* Study Group */}
                <div className="space-y-2">
                  <Label htmlFor="study_group_id">Kelompok Belajar</Label>
                  <Select
                    value={data.study_group_id}
                    onValueChange={(value) => setData("study_group_id", value)}
                  >
                    <SelectTrigger className={errors.study_group_id ? "ring-destructive" : ""}>
                      <SelectValue placeholder="Pilih kelompok belajar" />
                    </SelectTrigger>
                    <SelectContent>
                      {studyGroups?.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.study_group_id && <span className="text-sm text-destructive">{errors.study_group_id}</span>}
                </div>
              </div>
            </div>

            {/* Optional Fields Section */}
            <div className="mt-6 space-y-6">
              <h3 className="text-lg font-medium">Informasi Tambahan</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Shift */}
                <div className="space-y-2">
                  <Label htmlFor="shift_id">Shift</Label>
                  <Select
                    value={data.shift_id ?? ""}
                    onValueChange={(value) => setData("shift_id", value)}
                  >
                    <SelectTrigger className={errors.shift_id ? "ring-destructive" : ""}>
                      <SelectValue placeholder="Pilih shift" />
                    </SelectTrigger>
                    <SelectContent>
                      {shifts?.map((shift) => (
                        <SelectItem key={shift.id} value={shift.id}>
                          {shift.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.shift_id && <span className="text-sm text-destructive">{errors.shift_id}</span>}
                </div>

                {/* Major */}
                <ComboboxForm
                  label="Jurusan"
                  value={data.major_id ?? ""}
                  onValueChange={(value) => setData("major_id", value)}
                  options={majors.map(major => ({
                    value: major.id,
                    label: major.name
                  }))}
                  placeholder="Pilih jurusan"
                  searchPlaceholder="Cari Jurusan..."
                  emptyMessage="Jurusan tidak ditemukan."
                  error={!!errors.major_id}
                  errorMessage={errors.major_id}
                />

                {/* Room Number */}
                <div className="space-y-2">
                  <Label htmlFor="room_number">Nomor Ruangan</Label>
                  <Input
                    id="room_number"
                    value={data.room_number ?? ''}
                    onChange={(e) => setData("room_number", e.target.value)}
                    placeholder="Masukkan nomor ruangan"
                    className={errors.room_number ? "ring-destructive" : ""}
                  />
                  {errors.room_number && <span className="text-sm text-destructive">{errors.room_number}</span>}
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
