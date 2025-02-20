import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { WarningLetter } from "../data/schema"
import { useEffect, useState } from "react"
import { router, useForm } from "@inertiajs/react"  // Use this instead of useForm
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function WarningLetterReport({
    warningLetter,
    open,
    onOpenChange,
    shouldMarkAsRead = false,
    isStudentView = false
}: {
    warningLetter: WarningLetter
    open: boolean
    onOpenChange: (open: boolean) => void
    shouldMarkAsRead?: boolean
    isStudentView?: boolean
}) {
    const [isLoading, setIsLoading] = useState(false)
    const [hasAttemptedReceive, setHasAttemptedReceive] = useState(false)
    const { post } = useForm()

    useEffect(() => {
        if (!isStudentView && open && shouldMarkAsRead && !hasAttemptedReceive) {
            setIsLoading(true)
            setHasAttemptedReceive(true)

            post(route('warningLetters.receive', warningLetter.id), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setIsLoading(false)
                },
                onError: () => {
                    setIsLoading(false)
                }
            })
        }
    }, [open, warningLetter, shouldMarkAsRead, isStudentView])

    useEffect(() => {
        if (!open) {
            setIsLoading(false)
            setHasAttemptedReceive(false)
        }
    }, [open])

    // Prevent sheet from closing while loading
    const handleOpenChange = (newOpen: boolean) => {
        if (isLoading) return
        onOpenChange(newOpen)
    }

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent
                aria-describedby={""}
                side="right"
                className="w-full max-w-[100vw] sm:max-w-[640px] overflow-y-auto"
            >
                <SheetHeader>
                    <SheetTitle></SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-8">
                    {/* Header */}
                    <div className="space-y-2 text-center">
                        <h2 className="text-xl font-bold">SURAT PERINGATAN</h2>
                        <p className="text-sm text-muted-foreground">Nomor: {warningLetter.letter_number}</p>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-6">
                        {/* Student Info */}
                        <div className="space-y-1">
                            <div className="grid grid-cols-[120px_auto] gap-2">
                                <p className="text-sm">Nama Siswa</p>
                                <p className="text-sm font-medium">: {warningLetter.student.name}</p>
                            </div>
                            <div className="grid grid-cols-[120px_auto] gap-2">
                                <p className="text-sm">NIS</p>
                                <p className="text-sm font-medium">: {warningLetter.student.nis}</p>
                            </div>
                            <div className="grid grid-cols-[120px_auto] gap-2">
                                <p className="text-sm">Tanggal</p>
                                <p className="text-sm font-medium">: {format(new Date(warningLetter.issued_date), 'dd MMMM yyyy', { locale: id })}</p>
                            </div>
                        </div>

                        {/* Warning Content */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm">Dengan ini kami sampaikan bahwa siswa tersebut di atas telah melakukan pelanggaran:</p>
                                <div className="p-4 border rounded-lg">
                                    <p className="text-sm font-medium">Kategori: {warningLetter.warning_category.category_name} (Level {warningLetter.warning_category.level})</p>
                                    <p className="mt-2 text-sm">{warningLetter.description}</p>
                                </div>
                            </div>

                            {warningLetter.follow_up_notes && (
                                <div className="space-y-2">
                                    <p className="text-sm">Tindak lanjut:</p>
                                    <div className="p-4 border rounded-lg">
                                        <p className="text-sm">{warningLetter.follow_up_notes}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Signatures */}
                        <div className="grid grid-cols-2 gap-4 pt-8">
                            <div className="space-y-16 text-center">
                                <p className="text-sm">Wali Kelas</p>
                                <div>
                                    <p className="text-sm font-medium">{warningLetter.creator.name}</p>
                                    <p className="text-xs text-muted-foreground">NIP. {warningLetter.creator.email}</p>
                                </div>
                            </div>
                            <div className="space-y-16 text-center">
                                <p className="text-sm">Orang Tua/Wali</p>
                                <div>
                                    <p className="text-sm font-medium">{warningLetter.parent.name}</p>
                                    {warningLetter.parent_received_at && (
                                        <p className="text-xs text-muted-foreground">
                                            Diterima: {format(new Date(warningLetter.parent_received_at), 'dd/MM/yyyy HH:mm', { locale: id })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        {!isStudentView && (
                            <div className="pt-4">
                                <Button variant="outline" className="w-full" onClick={() => window.print()}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Unduh PDF
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
