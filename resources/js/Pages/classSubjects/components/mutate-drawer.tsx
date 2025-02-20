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
import { GroupedClassSubject, Day, FormData, SelectResponse } from '../data/schema'
import { useResourceContext } from '../context/context'
import { ComboboxForm } from '@/components/ComboboxForm'
import { days } from '@/helpers/day'
import { formatHI } from '@/helpers/FormatHI'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: GroupedClassSubject
}

export function MutateDrawer({ open, onOpenChange, currentRow }: Props) {
    const isUpdate = !!currentRow
    const { resourceName, mainRoute } = useResourceContext()
    const { subjectTeachers, classrooms } = usePage<SelectResponse>().props

    const { data, setData, post, put, errors, processing, reset } = useForm<FormData>({
        subject_teacher_id: currentRow?.subject_teacher_id ?? "",
        classroom_id: currentRow?.classroom_id ?? "",
        day: currentRow?.day ?? "Monday",
        start_time: formatHI(currentRow?.start_time ?? "") ?? formatHI(""),
        end_time: formatHI(currentRow?.end_time ?? "") ?? formatHI(""),
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
                <form id="class-subjects-form" onSubmit={onSubmit} className="flex flex-col h-full">
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
                                {/* Subject Teacher Combination */}
                                <ComboboxForm
                                    label="Guru Mata Pelajaran"
                                    value={data.subject_teacher_id}
                                    onValueChange={(value) => setData("subject_teacher_id", value)}
                                    options={subjectTeachers.map(subjectTeacher => ({
                                        value: subjectTeacher.id,
                                        label: `${subjectTeacher.subject.name} - ${subjectTeacher.teacher.name}`
                                    }))}
                                    placeholder="Pilih guru mata pelajaran"
                                    searchPlaceholder="Cari guru mata pelajaran..."
                                    emptyMessage="Guru mata pelajaran tidak ditemukan."
                                    error={!!errors.subject_teacher_id}
                                    errorMessage={errors.subject_teacher_id}
                                />

                                {/* Day Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="day">Hari</Label>
                                    <Select value={data.day} onValueChange={(value) => setData("day", value as Day)}>
                                        <SelectTrigger className={errors.day ? "ring-destructive" : ""}>
                                            <SelectValue placeholder="Pilih hari" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {days.map((day) => (
                                                <SelectItem key={day} value={day}>
                                                    {day}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.day && <span className="text-sm text-destructive">{errors.day}</span>}
                                </div>

                                {/* Time Selection */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_time">Waktu Mulai</Label>
                                        <Input
                                            id="start_time"
                                            type="time"
                                            step="1800"
                                            value={data.start_time}
                                            onChange={(e) => setData("start_time", e.target.value)}
                                            className={errors.start_time ? "ring-destructive" : ""}
                                        />
                                        {errors.start_time && <span className="text-sm text-destructive">{errors.start_time}</span>}
                                    </div>

                                    {/* End Time */}
                                    <div className="space-y-2">
                                        <Label htmlFor="end_time">Waktu Selesai</Label>
                                        <Input
                                            id="end_time"
                                            type="time"
                                            step="1800"
                                            value={data.end_time}
                                            onChange={(e) => setData("end_time", e.target.value)}
                                            className={errors.end_time ? "ring-destructive" : ""}
                                        />
                                        {errors.end_time && <span className="text-sm text-destructive">{errors.end_time}</span>}
                                    </div>
                                </div>

                                {/* Classroom */}
                                <ComboboxForm
                                    label="Kelas"
                                    value={data.classroom_id}
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
