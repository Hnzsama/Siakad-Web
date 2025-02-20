import React from 'react'
import { useForm } from '@inertiajs/react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { WarningLetter } from '../data/schema'
import { useResourceContext } from '../context/context'
import DatePickerYear from '@/components/DataPickerYear'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: WarningLetter
}

export function CancelDialog({ open, onOpenChange, currentRow }: Props) {
    const { mainRoute } = useResourceContext()

    const { data, setData, put, errors, processing, reset } = useForm({
        cancelled_at: "",
        cancellation_reason: "",
        cancellation_document_path: null as File | null,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        put(route(`${mainRoute}.cancel`, { id: currentRow?.id }), {
            onError: (errors: any) => {
                console.error('Error:', errors);
                toast({
                    variant: "destructive",
                    title: `Gagal membatalkan surat peringatan`,
                    description: "Silakan periksa kembali form anda"
                })
            },
            onSuccess: () => {
                toast({
                    title: "Surat Peringatan dibatalkan",
                    description: "Surat peringatan telah berhasil dibatalkan"
                })
                onOpenChange(false)
                reset()
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={(v) => {
            onOpenChange(v)
            if (!v) reset()
        }}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Pembatalan Surat Peringatan</DialogTitle>
                        <DialogDescription>
                            Masukkan informasi pembatalan surat peringatan.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <DatePickerYear
                            id="cancelled_at"
                            label="Tanggal Pembatalan"
                            value={data.cancelled_at}
                            onChange={(date) => setData("cancelled_at", date)}
                            error={errors.cancelled_at}
                        />

                        <div className="space-y-2">
                            <Label htmlFor="cancellation_reason">Alasan Pembatalan</Label>
                            <Textarea
                                id="cancellation_reason"
                                value={data.cancellation_reason}
                                onChange={(e) => setData("cancellation_reason", e.target.value)}
                                placeholder="Masukkan alasan pembatalan"
                                className={errors.cancellation_reason ? "ring-destructive" : ""}
                            />
                            {errors.cancellation_reason && <span className="text-sm text-destructive">{errors.cancellation_reason}</span>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cancellation_document_path">Dokumen Pembatalan</Label>
                            <Input
                                id="cancellation_document_path"
                                type="file"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        setData("cancellation_document_path", file)
                                    }
                                }}
                                className={errors.cancellation_document_path ? "ring-destructive" : ""}
                            />
                            {errors.cancellation_document_path && <span className="text-sm text-destructive">{errors.cancellation_document_path}</span>}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={processing}
                        >
                            {processing ? "Menyimpan..." : "Konfirmasi Pembatalan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
