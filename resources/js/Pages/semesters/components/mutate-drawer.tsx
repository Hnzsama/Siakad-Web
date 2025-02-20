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
import { Semester, FormData } from '../data/schema'
import { useResourceContext } from '../context/context'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { SelectValue } from '@radix-ui/react-select'
import DatePickerForm from '@/components/DatePickerForm'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Semester
}

export function MutateDrawer({ open, onOpenChange, currentRow }: Props) {
  const isUpdate = !!currentRow
  const { resourceName, mainRoute } = useResourceContext()

  const { data, setData, post, put, errors, processing, reset } = useForm<FormData>({
    name: currentRow?.name ?? "",
    type: currentRow?.type ?? "odd",
    status: currentRow?.status ?? "pending",
    academic_year: currentRow?.academic_year ?? "",
    start_date: currentRow?.start_date ?? "",
    end_date: currentRow?.end_date ?? "",
    description: currentRow?.description ?? null,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const options = {
      onError: (errors: any) => {
        console.error('Error:', errors);
        reset()
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
            {/* Informasi Wajib */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Informasi Wajib</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Nama */}
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

                {/* Tahun Akademik */}
                <div className="space-y-2">
                  <Label htmlFor="academic_year">Tahun Akademik</Label>
                  <Input
                    id="academic_year"
                    value={data.academic_year}
                    onChange={(e) => setData("academic_year", e.target.value)}
                    placeholder="Tahun akademik (e.g., 2024/2025)"
                    className={errors.academic_year ? "ring-destructive" : ""}
                  />
                  {errors.academic_year && (
                    <span className="text-sm text-destructive">{errors.academic_year}</span>
                  )}
                </div>

                {/* Tanggal Mulai */}
                <DatePickerForm
                  id="start_date"
                  label="Tanggal Mulai"
                  value={data.start_date}
                  onChange={(date) => setData("start_date", date)}
                  error={errors.start_date}
                />

                {/* Tanggal Berakhir */}
                <DatePickerForm
                  id="end_date"
                  label="Tanggal Berakhir"
                  value={data.end_date}
                  onChange={(date) => setData("end_date", date)}
                  error={errors.end_date}
                />

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={data.status}
                    onValueChange={(value) => setData("status", value as "active" | "completed" | "pending")}
                  >
                    <SelectTrigger id="status" className={errors.status ? "ring-destructive" : ""}>
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="completed">Selesai</SelectItem>
                      <SelectItem value="pending">Tertunda</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && <span className="text-sm text-destructive">{errors.status}</span>}
                </div>
              </div>
            </div>

            {/* Informasi Tambahan */}
            <div className="mt-6 space-y-6">
              <h3 className="text-lg font-medium">Informasi Tambahan</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Deskripsi */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={data.description || ""}
                    onChange={(e) => setData("description", e.target.value)}
                    placeholder="Masukkan deskripsi"
                  />
                  {errors.description && (
                    <span className="text-sm text-destructive">{errors.description}</span>
                  )}
                </div>

                {/* Tipe */}
                <div className="space-y-2">
                  <Label htmlFor="type" className='hidden'>Tipe</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="type"
                      checked={data.type === "odd"}
                      onCheckedChange={(checked) => setData("type", checked ? "odd" : "even")}
                    />
                    <span className="text-sm text-muted-foreground">
                      {data.type === "odd" ? "Ganjil" : "Genap"}
                    </span>
                  </div>
                  {errors.type && <span className="text-sm text-destructive">{errors.type}</span>}
                </div>
              </div>
            </div>

          </div>
          {/* Tombol Footer */}
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
