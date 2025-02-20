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
import { Textarea } from '@/components/ui/textarea'
import { Violation, FormData, SelectResponse } from '../data/schema'
import { useResourceContext } from '../context/context'
import { ComboboxForm } from '@/components/ComboboxForm'
import DatePickerYear from '@/components/DataPickerYear'
import { CancelDialog } from './cancel-dialog'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: Violation
}

export function MutateDrawer({ open, onOpenChange, currentRow }: Props) {
    const isUpdate = !!currentRow
    const { resourceName, mainRoute } = useResourceContext()
    const { violationTypes, students } = usePage<SelectResponse>().props
    const [showCancelDialog, setShowCancelDialog] = React.useState(false)

    const { data, setData, post, put, errors, processing, reset } = useForm<FormData>({
        student_id: currentRow?.student_id ?? "",
        violation_type_id: currentRow?.violation_type_id ?? "",
        violation_date: currentRow?.violation_date ?? new Date().toISOString(),
        description: currentRow?.description ?? "",
        document_path: currentRow?.document_path ?? null,
        sanction_start_date: currentRow?.sanction_start_date ?? null,
        sanction_end_date: currentRow?.sanction_end_date ?? null,
        sanction_notes: currentRow?.sanction_notes ?? null,
        status: currentRow?.status ?? "pending"
    });

    const canModifyStatus = currentRow?.status === 'pending'

    const handleCancel = () => {
        setShowCancelDialog(true)
    }

    const handleApprove = () => {
        put(route(`${mainRoute}.approve`, { id: currentRow?.id }), {
            onSuccess: () => {
                toast({
                    title: "Pelanggaran disetujui",
                    description: "Pelanggaran telah berhasil disetujui"
                })
                onOpenChange(false)
            }
        })
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
                            {/* Required Fields Section */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium">Informasi Wajib</h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {/* Student Selection */}
                                    <ComboboxForm
                                        label="Siswa"
                                        value={data.student_id}
                                        onValueChange={(value) => setData("student_id", value)}
                                        options={students.map(student => ({
                                            value: student.id,
                                            label: `${student.nis} - ${student.name}`
                                        }))}
                                        placeholder="Pilih siswa"
                                        searchPlaceholder="Cari siswa..."
                                        emptyMessage="Siswa tidak ditemukan."
                                        error={!!errors.student_id}
                                        errorMessage={errors.student_id}
                                    />

                                    {/* Violation Type Selection */}
                                    <ComboboxForm
                                        label="Jenis Pelanggaran"
                                        value={data.violation_type_id}
                                        onValueChange={(value) => setData("violation_type_id", value)}
                                        options={violationTypes.map(type => ({
                                            value: type.id,
                                            label: type.name
                                        }))}
                                        placeholder="Pilih jenis pelanggaran"
                                        searchPlaceholder="Cari jenis pelanggaran..."
                                        emptyMessage="Jenis pelanggaran tidak ditemukan."
                                        error={!!errors.violation_type_id}
                                        errorMessage={errors.violation_type_id}
                                    />

                                    {/* Violation Date */}
                                    <DatePickerYear
                                        id="violation_date"
                                        label="Tanggal Pelanggaran"
                                        value={data.violation_date}
                                        onChange={(date) => setData("violation_date", date)}
                                        error={errors.violation_date}
                                    />

                                    {/* Description */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="description">Deskripsi</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData("description", e.target.value)}
                                            placeholder="Masukkan deskripsi pelanggaran"
                                            className={errors.description ? "ring-destructive" : ""}
                                            rows={4}
                                        />
                                        {errors.description && <span className="text-sm text-destructive">{errors.description}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Optional Fields Section */}
                            <div className="mt-6 space-y-6">
                                <h3 className="text-lg font-medium">Informasi Tambahan</h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {/* Document Upload */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="document">Dokumen</Label>
                                        <Input
                                            id="document"
                                            type="file"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setData("document_path", file as any);
                                                }
                                            }}
                                            className={errors.document_path ? "ring-destructive" : ""}
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        />
                                        {errors.document_path && <span className="text-sm text-destructive">{errors.document_path}</span>}
                                    </div>

                                    {/* Sanctions Section */}
                                    <DatePickerYear
                                        id="sanction_start_date"
                                        label="Tanggal Mulai Sanksi"
                                        value={data.sanction_start_date ?? ""}
                                        onChange={(date) => setData("sanction_start_date", date)}
                                        error={errors.sanction_start_date}
                                    />

                                    <DatePickerYear
                                        id="sanction_end_date"
                                        label="Tanggal Selesai Sanksi"
                                        value={data.sanction_end_date ?? ""}
                                        onChange={(date) => setData("sanction_end_date", date)}
                                        error={errors.sanction_end_date}
                                    />

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="sanction_notes">Catatan Sanksi</Label>
                                        <Textarea
                                            id="sanction_notes"
                                            value={data.sanction_notes ?? ""}
                                            onChange={(e) => setData("sanction_notes", e.target.value)}
                                            placeholder="Masukkan catatan sanksi"
                                            className={errors.sanction_notes ? "ring-destructive" : ""}
                                            rows={3}
                                        />
                                        {errors.sanction_notes && <span className="text-sm text-destructive">{errors.sanction_notes}</span>}
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
                                            onClick={handleCancel}
                                            disabled={processing}
                                        >
                                            Batalkan
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

            <CancelDialog
                open={showCancelDialog}
                onOpenChange={setShowCancelDialog}
                currentRow={currentRow}
            />
        </>
    )
}
