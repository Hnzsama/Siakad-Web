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
import { Shift, FormData } from '../data/schema'
import { useResourceContext } from '../context/context'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: Shift
}

export function MutateDrawer({ open, onOpenChange, currentRow }: Props) {
    const isUpdate = !!currentRow
    const { resourceName, mainRoute } = useResourceContext()
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)

    const { data, setData, post, put, errors, processing, reset } = useForm<FormData>({
        name: currentRow?.name ?? "",
        status: currentRow?.status ?? 1,
        class_duration: currentRow?.class_duration ?? 0,
    });

    const handleSubmit = () => {
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

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (isUpdate && currentRow && data.class_duration !== currentRow.class_duration) {
            setShowConfirmDialog(true)
        } else {
            handleSubmit()
        }
    }

    return (
        <>
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Perubahan Durasi</AlertDialogTitle>
                        <AlertDialogDescription>
                            Mengubah durasi pembelajaran akan menghapus semua jadwal pelajaran yang terkait dengan shift ini. Apakah Anda yakin ingin melanjutkan?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit}>Lanjutkan</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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

                        <div className="flex flex-col px-6 space-y-6">
                            {/* Name */}
                            <div>
                                <Label htmlFor="name">Nama</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    placeholder="Masukkan nama"
                                    className={errors.name ? "ring-destructive" : ""}
                                />
                                {errors.name && (
                                    <span className="text-sm text-destructive">
                                        {errors.name}
                                    </span>
                                )}
                            </div>

                            {/* Class Duration  */}
                            <div className="space-y-2">
                                <Label htmlFor="class_duration">Durasi Pembelajaran</Label>
                                <Input
                                    id="class_duration"
                                    type="number"
                                    value={data.class_duration ?? ""}
                                    onChange={(e) => setData("class_duration", Number(e.target.value))}
                                    className={errors.class_duration ? "ring-destructive" : ""}
                                />
                                {errors.class_duration && <span className="text-sm text-destructive">{errors.class_duration}</span>}
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="status"
                                    checked={data.status}
                                    onCheckedChange={(checked) => setData("status", checked)}
                                />
                                <Label htmlFor="status">Aktif</Label>
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
        </>
    )
}
