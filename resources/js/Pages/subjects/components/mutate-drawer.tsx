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
import { Subject, FormData } from '../data/schema'
import { useResourceContext } from '../context/context'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Subject
}

export function MutateDrawer({ open, onOpenChange, currentRow }: Props) {
  const isUpdate = !!currentRow
  const { resourceName, mainRoute } = useResourceContext()

  const { data, setData, post, put, errors, processing, reset } = useForm<FormData>({
    name: currentRow?.name ?? "",
    type: currentRow?.type ?? "theorical",
    code: currentRow?.code ?? null,
    description: currentRow?.description ?? null,
    status: currentRow?.status ?? true
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
            {/* Required Fields Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Informasi Wajib</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Mata Pelajaran</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={e => setData("name", e.target.value)}
                    placeholder="Masukkan nama mata pelajaran"
                    className={errors.name ? "ring-destructive" : ""}
                  />
                  {errors.name && (
                    <span className="text-sm text-destructive">{errors.name}</span>
                  )}
                </div>

                {/* Tipe */}
                <div className="space-y-2">
                  <Label htmlFor="type">Tipe</Label>
                  <Select
                    value={data.type}
                    onValueChange={(value: "theorical" | "practical") => setData("type", value)}
                  >
                    <SelectTrigger className={errors.type ? "ring-destructive" : ""}>
                      <SelectValue placeholder="Pilih Tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="theorical">Teori</SelectItem>
                      <SelectItem value="practical">Praktik</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && <span className="text-sm text-destructive">{errors.type}</span>}
                </div>
              </div>
            </div>

            {/* Optional Fields Section */}
            <div className="mt-6 space-y-6">
              <h3 className="text-lg font-medium">Informasi Tambahan</h3>
              <div className="grid grid-cols-1 gap-4">
                {/* Code */}
                <div className="space-y-2">
                  <Label htmlFor="code">Kode Mata Pelajaran</Label>
                  <Input
                    id="code"
                    value={data.code ?? ''}
                    onChange={e => setData("code", e.target.value)}
                    placeholder="Masukkan kode mata pelajaran"
                    className={errors.code ? "ring-destructive" : ""}
                  />
                  {errors.code && (
                    <span className="text-sm text-destructive">{errors.code}</span>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={data.description ?? ''}
                    onChange={e => setData("description", e.target.value)}
                    rows={4}
                    placeholder="Masukkan deskripsi"
                    className={errors.description ? "ring-destructive" : ""}
                  />
                  {errors.description && (
                    <span className="text-sm text-destructive">{errors.description}</span>
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
