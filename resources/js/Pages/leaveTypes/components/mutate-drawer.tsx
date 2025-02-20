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
import { LeaveType, FormData } from '../data/schema'
import { useResourceContext } from '../context/context'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: LeaveType
}

export function MutateDrawer({ open, onOpenChange, currentRow }: Props) {
    const isUpdate = !!currentRow
    const { resourceName, mainRoute } = useResourceContext()

    const { data, setData, post, put, errors, processing, reset } = useForm<FormData>({
        leave_name: currentRow?.leave_name ?? "",
        description: currentRow?.description ?? "",
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
                <form id="leave-type-form" onSubmit={onSubmit} className="flex flex-col h-full">
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
                            <div className="grid grid-cols-1 gap-4">
                                {/* Leave Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="leave_name">Nama Cuti</Label>
                                    <Input
                                        id="leave_name"
                                        value={data.leave_name}
                                        onChange={(e) => setData("leave_name", e.target.value)}
                                        placeholder="Masukkan nama cuti"
                                        maxLength={255}
                                        className={errors.leave_name ? "ring-destructive" : ""}
                                    />
                                    {errors.leave_name && <span className="text-sm text-destructive">{errors.leave_name}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Optional Fields Section */}
                        <div className="mt-6 space-y-6">
                            <h3 className="text-lg font-medium">Informasi Tambahan</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Deskripsi</Label>
                                    <Input
                                        id="description"
                                        value={data.description ?? ""}
                                        onChange={(e) => setData("description", e.target.value)}
                                        placeholder="Masukkan deskripsi"
                                        maxLength={255}
                                        className={errors.description ? "ring-destructive" : ""}
                                    />
                                    {errors.description && <span className="text-sm text-destructive">{errors.description}</span>}
                                </div>
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
