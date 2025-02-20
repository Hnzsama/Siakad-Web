import React from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { WarningLetter, FormData, SelectResponse } from '../data/schema'
import { useResourceContext } from '../context/context'
import { ComboboxForm } from '@/components/ComboboxForm'
import DatePickerYear from '@/components/DataPickerYear'
import { CancelDialog } from './cancel-dialog'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: WarningLetter
}

export function MutateDrawer({ open, onOpenChange, currentRow }: Props) {
    const isUpdate = !!currentRow
    const { resourceName, mainRoute } = useResourceContext()
    const { students, warningCategories } = usePage<SelectResponse>().props

    const { data, setData, post, put, errors, processing, reset } = useForm<FormData>({
        letter_number: currentRow?.letter_number ?? "",
        student_id: currentRow?.student_id ?? "",
        warning_category_id: currentRow?.warning_category_id ?? "",
        issued_date: currentRow?.issued_date ?? "",
        description: currentRow?.description ?? "",
        document_path: null,
        parent_received_at: currentRow?.parent_received_at ?? null,
        parent_signature_path: currentRow?.parent_signature_path ?? null,
        follow_up_date: currentRow?.follow_up_date ?? null,
        follow_up_notes: currentRow?.follow_up_notes ?? null,
        cancelled_at: currentRow?.cancelled_at ?? null,
        cancellation_reason: currentRow?.cancellation_reason ?? null,
        cancelled_by: currentRow?.cancelled_by ?? "",
        cancellation_document_path: null,
        approved_by: currentRow?.approved_by ?? null,
        status: currentRow?.status ?? "pending",
    })

    const [showCancelForm, setShowCancelForm] = React.useState(false)
    const [showCancelDialog, setShowCancelDialog] = React.useState(false)

    const canModifyStatus = currentRow?.status === 'pending'

    const handleCancel = () => {
        setShowCancelDialog(true)
    }

    const handleApprove = () => {
        put(route(`${mainRoute}.approve`, { id: currentRow?.id }), {
            onSuccess: () => {
                toast({
                    title: "Surat Peringatan disetujui",
                    description: "Surat peringatan telah berhasil disetujui"
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
                    setShowCancelForm(false)
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
                                    {/* Letter Number */}
                                    <div className="space-y-2">
                                        <Label htmlFor="letter_number">Nomor Surat</Label>
                                        <Input
                                            id="letter_number"
                                            value={data.letter_number}
                                            onChange={(e) => setData("letter_number", e.target.value)}
                                            placeholder="Masukkan nomor surat"
                                            className={errors.letter_number ? "ring-destructive" : ""}
                                        />
                                        {errors.letter_number && <span className="text-sm text-destructive">{errors.letter_number}</span>}
                                    </div>

                                    {/* Student */}
                                    <ComboboxForm
                                        label="Siswa"
                                        value={data.student_id}
                                        onValueChange={(value) => setData("student_id", value)}
                                        options={students.map(student => ({
                                            value: student.id,
                                            label: student.name
                                        }))}
                                        placeholder="Pilih siswa"
                                        error={!!errors.student_id}
                                        errorMessage={errors.student_id}
                                    />

                                    {/* Warning Category */}
                                    <ComboboxForm
                                        label="Kategori Peringatan"
                                        value={data.warning_category_id}
                                        onValueChange={(value) => setData("warning_category_id", value)}
                                        options={warningCategories.map(category => ({
                                            value: category.id,
                                            label: category.category_name
                                        }))}
                                        placeholder="Pilih kategori"
                                        error={!!errors.warning_category_id}
                                        errorMessage={errors.warning_category_id}
                                    />

                                    {/* Issued Date */}
                                    <DatePickerYear
                                        id="issued_date"
                                        label="Tanggal Surat"
                                        value={data.issued_date}
                                        onChange={(date) => setData("issued_date", date)}
                                        error={errors.issued_date}
                                    />

                                    {/* Description */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="description">Deskripsi</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData("description", e.target.value)}
                                            placeholder="Masukkan deskripsi"
                                            className={errors.description ? "ring-destructive" : ""}
                                        />
                                        {errors.description && <span className="text-sm text-destructive">{errors.description}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Follow-up Section */}
                            {isUpdate && (
                                <div className="mt-6 space-y-6">
                                    <h3 className="text-lg font-medium">Tindak Lanjut</h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <DatePickerYear
                                            id="follow_up_date"
                                            label="Tanggal Tindak Lanjut"
                                            value={data.follow_up_date ?? ""}
                                            onChange={(date) => setData("follow_up_date", date)}
                                            error={errors.follow_up_date}
                                        />

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="follow_up_notes">Catatan Tindak Lanjut</Label>
                                            <Textarea
                                                id="follow_up_notes"
                                                value={data.follow_up_notes ?? ""}
                                                onChange={(e) => setData("follow_up_notes", e.target.value)}
                                                placeholder="Masukkan catatan tindak lanjut"
                                                className={errors.follow_up_notes ? "ring-destructive" : ""}
                                            />
                                            {errors.follow_up_notes && <span className="text-sm text-destructive">{errors.follow_up_notes}</span>}
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                            Batalkan Surat
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
