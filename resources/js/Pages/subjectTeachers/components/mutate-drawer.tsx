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
import { SubjectTeacher, FormData, SelectResponse } from '../data/schema'
import { useResourceContext } from '../context/context'
import { ComboboxForm } from '@/components/ComboboxForm'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: SubjectTeacher
}

export function MutateDrawer({ open, onOpenChange, currentRow }: Props) {
    const isUpdate = !!currentRow
    const { resourceName, mainRoute } = useResourceContext()
    const { subjects, teachers } = usePage<SelectResponse>().props

    const { data, setData, post, put, errors, processing, reset } = useForm<FormData>({
        subject_id: currentRow?.subject_id ?? "",
        teacher_id: currentRow?.teacher_id ?? "",
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const submitData = {
            subject_id: data.subject_id,
            teacher_id: data.teacher_id
        };

        const options = {
            onError: (errors: any) => {
                console.error('Error:', errors);
                console.log(data)
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
            put(route(`${mainRoute}.update`, { id: currentRow.id }), {
                ...options,
                data: submitData
            })
        } else {
            post(route(`${mainRoute}.store`), {
                ...options,
                data: submitData
            })
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
                <form id="subject-teacher-form" onSubmit={onSubmit} className="flex flex-col h-full">
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
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">Informasi Wajib</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Subject Selection */}
                                <ComboboxForm
                                    label="Mata Pelajaran"
                                    value={data.subject_id}
                                    onValueChange={(value) => setData("subject_id", value)}
                                    options={subjects.map(subject => ({
                                        value: subject.id,
                                        label: subject.name
                                    }))}
                                    placeholder="Pilih mata pelajaran"
                                    searchPlaceholder="Cari mata pelajaran..."
                                    emptyMessage="Mata pelajaran tidak ditemukan."
                                    error={!!errors.subject_id}
                                    errorMessage={errors.subject_id}
                                />

                                {/* Teacher Selection */}
                                <ComboboxForm
                                    label="Guru"
                                    value={data.teacher_id}
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
