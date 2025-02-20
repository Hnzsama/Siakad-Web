import React, { useEffect, useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { LeaveRequest, FormData, SelectResponse } from '../data/schema'
import { useResourceContext } from '../context/context'
import { ComboboxForm } from '@/components/ComboboxForm'
import DatePickerYear from '@/components/DataPickerYear'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RejectDialog } from './reject-dialog'
import { hasAnyRole, hasRole } from '@/utils/permissions'
import DatePickerFuture from '@/components/DatePickerFuture'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: LeaveRequest
}

const MODEL_TYPES = {
    STUDENT: 'App\\Models\\Student',
    TEACHER: 'App\\Models\\Teacher'
} as const;

export function MutateDrawer({ open, onOpenChange, currentRow }: Props) {
    const isUpdate = !!currentRow
    const { resourceName, mainRoute } = useResourceContext()
    const { user } = usePage().props.auth
    const { leaveTypes, students, teachers } = usePage<SelectResponse>().props

    const canModifyStatus = currentRow?.status === 'Pending'
    const isGuardian = hasRole('guardian')

    const { data, setData, post, put, errors, processing, reset } = useForm<FormData>({
        leavable_id: currentRow?.leavable_id ?? "",
        leavable_type: currentRow?.leavable_type ?? hasRole('teacher') ? MODEL_TYPES.TEACHER : MODEL_TYPES.STUDENT,
        leave_type_id: currentRow?.leave_type_id ?? "",
        start_date: currentRow?.start_date ?? new Date().toISOString().split('T')[0],
        end_date: currentRow?.end_date ?? new Date().toISOString().split('T')[0],
        reason: currentRow?.reason ?? "",
        attachment_url: null,
        status: currentRow?.status ?? "Pending",
    });

    useEffect(() => {
        if (user.teacher?.id) {
            setData("leavable_id", user.teacher.id)
        } else if (isGuardian) {
            setData("leavable_type", MODEL_TYPES.STUDENT)
        }
    }, [user.teacher?.id])

    const [showRejectDialog, setShowRejectDialog] = useState(false)

    const handleApprove = () => {
        put(route(`${mainRoute}.approve`, { id: currentRow?.id }), {
            onSuccess: () => {
                toast({
                    title: "Permintaan izin disetujui",
                    description: "Permintaan izin telah berhasil disetujui"
                })
                onOpenChange(false)
            }
        })
    }

    const handleReject = () => {
        setShowRejectDialog(true)
    }

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

    // Get the appropriate list based on selected type
    const currentList = data.leavable_type === MODEL_TYPES.STUDENT ? students : teachers;

    return (
        <>
            <Sheet open={open} onOpenChange={(v) => {
                onOpenChange(v)
                if (!v) {
                    reset()
                }
            }}>
                <SheetContent className="flex flex-col w-full h-full p-0 sm:max-w-xl">
                    <form onSubmit={onSubmit} className="flex flex-col h-full">
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
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {/* Type Selection */}
                                    <div className="space-y-2" hidden={hasAnyRole(['teacher', 'guardian'])}>
                                        <Label htmlFor="leavable_type">Tipe Pemohon</Label>
                                        <Select
                                            value={data.leavable_type}
                                            onValueChange={(value) => {
                                                setData(data => ({
                                                    ...data,
                                                    leavable_type: value,
                                                    leavable_id: "", // Reset the ID when type changes
                                                }))
                                            }}
                                        >
                                            <SelectTrigger className={errors.leavable_type ? "ring-destructive" : ""}>
                                                <SelectValue placeholder="Pilih tipe pemohon" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={MODEL_TYPES.STUDENT}>Siswa</SelectItem>
                                                <SelectItem value={MODEL_TYPES.TEACHER}>Guru</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.leavable_type && <span className="text-sm text-destructive">{errors.leavable_type}</span>}
                                    </div>

                                    {/* Requestor Selection */}
                                    <ComboboxForm
                                        label={data.leavable_type === MODEL_TYPES.STUDENT ? (hasRole('guardian') ? 'Anak' : 'Siswa') : 'Guru'}
                                        value={data.leavable_id ?? ""}
                                        onValueChange={(value) => setData("leavable_id", value)}
                                        options={currentList.map(item => ({
                                            value: item.id,
                                            label: item.name
                                        }))}
                                        placeholder={`Pilih ${data.leavable_type === MODEL_TYPES.STUDENT ? 'siswa' : 'guru'}`}
                                        searchPlaceholder={`Cari ${data.leavable_type === MODEL_TYPES.STUDENT ? 'siswa' : 'guru'}...`}
                                        emptyMessage={`${data.leavable_type === MODEL_TYPES.STUDENT ? 'Siswa' : 'Guru'} tidak ditemukan.`}
                                        error={!!errors.leavable_id}
                                        errorMessage={errors.leavable_id}
                                        hidden={hasRole('teacher')}
                                    />

                                    <ComboboxForm
                                        label="Jenis Izin"
                                        value={data.leave_type_id}
                                        onValueChange={(value) => setData("leave_type_id", value)}
                                        options={leaveTypes.map(type => ({
                                            value: type.id,
                                            label: type.leave_name
                                        }))}
                                        placeholder="Pilih jenis izin"
                                        searchPlaceholder="Cari jenis izin..."
                                        emptyMessage="Jenis izin tidak ditemukan."
                                        error={!!errors.leave_type_id}
                                        errorMessage={errors.leave_type_id}
                                    />

                                    <DatePickerFuture
                                        id="start_date"
                                        label="Tanggal Mulai"
                                        value={data.start_date}
                                        onChange={(date) => setData("start_date", date)}
                                        error={errors.start_date}
                                    />

                                    <DatePickerFuture
                                        id="end_date"
                                        label="Tanggal Selesai"
                                        value={data.end_date}
                                        onChange={(date) => setData("end_date", date)}
                                        error={errors.end_date}
                                    />

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="reason">Alasan</Label>
                                        <Textarea
                                            id="reason"
                                            value={data.reason}
                                            onChange={(e) => setData("reason", e.target.value)}
                                            placeholder="Masukkan alasan izin"
                                            className={errors.reason ? "ring-destructive" : ""}
                                            rows={4}
                                        />
                                        {errors.reason && <span className="text-sm text-destructive">{errors.reason}</span>}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="attachment">Lampiran</Label>
                                        <Input
                                            id="attachment"
                                            type="file"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setData("attachment_url", file as any);
                                                }
                                            }}
                                            className={errors.attachment_url ? "ring-destructive" : ""}
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        />
                                        {errors.attachment_url && <span className="text-sm text-destructive">{errors.attachment_url}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <SheetFooter className="flex-shrink-0 gap-2">
                                <SheetClose asChild>
                                    <Button variant="outline">Tutup</Button>
                                </SheetClose>
                                {isUpdate && canModifyStatus && (
                                    <>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={handleReject}
                                            disabled={processing}
                                        >
                                            Tolak
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={handleApprove}
                                            disabled={processing}
                                        >
                                            Setujui
                                        </Button>
                                    </>
                                )}
                                {(!isUpdate || canModifyStatus) && (
                                    <Button type="submit" disabled={processing}>
                                        {processing ? "Menyimpan..." : "Simpan"}
                                    </Button>
                                )}
                            </SheetFooter>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>

            <RejectDialog
                open={showRejectDialog}
                onOpenChange={setShowRejectDialog}
                currentRow={currentRow}
            />
        </>
    )
}
