import React from 'react'
import { useForm } from '@inertiajs/react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { LeaveRequest } from '../data/schema'
import { useResourceContext } from '../context/context'
import DatePickerYear from '@/components/DataPickerYear'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: LeaveRequest
}

export function RejectDialog({ open, onOpenChange, currentRow }: Props) {
    const { mainRoute } = useResourceContext()

    const { data, setData, put, errors, processing, reset } = useForm({
        rejected_at: new Date().toISOString(),
        rejection_reason: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        put(route(`${mainRoute}.reject`, { id: currentRow?.id }), {
            onError: (errors: any) => {
                console.error('Error:', errors);
                toast({
                    variant: "destructive",
                    title: `Gagal menolak permintaan izin`,
                    description: "Silakan periksa kembali form anda"
                })
            },
            onSuccess: () => {
                toast({
                    title: "Permintaan izin ditolak",
                    description: "Permintaan izin telah berhasil ditolak"
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
                        <DialogTitle>Penolakan Permintaan Izin</DialogTitle>
                        <DialogDescription>
                            Masukkan informasi penolakan permintaan izin.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <DatePickerYear
                            id="rejected_at"
                            label="Tanggal Penolakan"
                            value={data.rejected_at}
                            onChange={(date) => setData("rejected_at", date)}
                            error={errors.rejected_at}
                        />

                        <div className="space-y-2">
                            <Label htmlFor="rejection_reason">Alasan Penolakan</Label>
                            <Textarea
                                id="rejection_reason"
                                value={data.rejection_reason}
                                onChange={(e) => setData("rejection_reason", e.target.value)}
                                placeholder="Masukkan alasan penolakan"
                                className={errors.rejection_reason ? "ring-destructive" : ""}
                            />
                            {errors.rejection_reason && <span className="text-sm text-destructive">{errors.rejection_reason}</span>}
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
                            {processing ? "Menyimpan..." : "Konfirmasi Penolakan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
