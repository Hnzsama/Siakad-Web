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
import { Schedule, FormData, SelectResponse } from '../data/schema'
import { useResourceContext } from '../context/context'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ComboboxForm } from '@/components/ComboboxForm'
import { formatHI } from '@/helpers/FormatHI'
import { days } from '@/helpers/day'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: Schedule
}

export function MutateDrawer({ open, onOpenChange, currentRow }: Props) {
    const isUpdate = !!currentRow
    const { resourceName, mainRoute } = useResourceContext()
    const { shifts } = usePage<SelectResponse>().props

    const { data, setData, post, put, errors, processing, reset } = useForm<FormData>({
        shift_id: currentRow?.shift_id ?? "",
        day: currentRow?.day ?? "Monday",
        start_time: formatHI(currentRow?.start_time) ?? formatHI(""),
        end_time: formatHI(currentRow?.end_time) ?? formatHI(""),
        entry_grace_period: formatHI(currentRow?.entry_grace_period ?? "") ?? formatHI(""),
        exit_grace_period: formatHI(currentRow?.exit_grace_period ?? "") ?? formatHI(""),
        status: currentRow?.status ?? true
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
                <form id="schedule-form" onSubmit={onSubmit} className="flex flex-col h-full">
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

                                {/* Day */}
                                <div className="space-y-2">
                                    <Label htmlFor="day">Hari</Label>
                                    <Select
                                        value={data.day}
                                        onValueChange={(value) => setData("day", value)}
                                    >
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

                                {/* Start Time */}
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
                        </div>

                        {/* Optional Fields Section */}
                        <div className="mt-6 space-y-6">
                            <h3 className="text-lg font-medium">Informasi Tambahan</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Entry Grace Period */}
                                <div className="space-y-2">
                                    <Label htmlFor="entry_grace_period">Grace Period Masuk</Label>
                                    <Input
                                        id="entry_grace_period"
                                        type="time"
                                        step="1800"
                                        value={data.entry_grace_period ?? ""}
                                        onChange={(e) => setData("entry_grace_period", e.target.value)}
                                        className={errors.entry_grace_period ? "ring-destructive" : ""}
                                    />
                                    {errors.entry_grace_period && <span className="text-sm text-destructive">{errors.entry_grace_period}</span>}
                                </div>

                                {/* Exit Grace Period */}
                                <div className="space-y-2">
                                    <Label htmlFor="exit_grace_period">Grace Period Keluar</Label>
                                    <Input
                                        id="exit_grace_period"
                                        type="time"
                                        step="1800"
                                        value={data.exit_grace_period ?? ""}
                                        onChange={(e) => setData("exit_grace_period", e.target.value)}
                                        className={errors.exit_grace_period ? "ring-destructive" : ""}
                                    />
                                    {errors.exit_grace_period && <span className="text-sm text-destructive">{errors.exit_grace_period}</span>}
                                </div>

                                {/* Status */}
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="status"
                                        checked={data.status}
                                        onCheckedChange={(checked) => setData("status", checked)}
                                    />
                                    <Label htmlFor="status">Status Aktif</Label>
                                    {errors.status && <span className="text-sm text-destructive">{errors.status}</span>}
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
