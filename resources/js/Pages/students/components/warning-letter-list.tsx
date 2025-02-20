import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import { BasicWarningLetter } from '@/Pages/warningLetters/data/schema'

export function WarningLetterList({ warningLetters }: { warningLetters: BasicWarningLetter[] }) {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold">Surat Peringatan</h3>
            <div className="space-y-4">
                {warningLetters?.map(letter => (
                    <div key={letter.id} className="p-4 space-y-4 border rounded-lg">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Nomor Surat</p>
                                <p className="text-sm text-muted-foreground">
                                    {letter.letter_number}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Tanggal</p>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(letter.issued_date), 'dd MMMM yyyy', { locale: id })}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Deskripsi</p>
                            <p className="text-sm text-muted-foreground">{letter.description}</p>
                        </div>
                        {letter.follow_up_notes && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Tindak Lanjut</p>
                                <p className="text-sm text-muted-foreground">{letter.follow_up_notes}</p>
                            </div>
                        )}
                        {letter.document_path && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto"
                                onClick={() => letter.document_path && window.open(letter.document_path, '_blank')}
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Lihat Dokumen
                            </Button>
                        )}
                    </div>
                ))}
                {(!warningLetters || warningLetters.length === 0) && (
                    <div className="py-6 text-center text-muted-foreground">
                        Tidak ada surat peringatan
                    </div>
                )}
            </div>
        </div>
    )
}
