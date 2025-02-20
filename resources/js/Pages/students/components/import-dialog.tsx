import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useForm, usePage } from '@inertiajs/react'
import { SelectResponse } from '../data/schema'
import { ComboboxForm } from '@/components/ComboboxForm'
import { Label } from '@/components/ui/label'
import { IconDownload } from '@tabler/icons-react'
import axios from 'axios'
import { useState } from 'react'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ImportDialog({ open, onOpenChange }: Props) {
    const { semesters, classrooms } = usePage<SelectResponse>().props
    const [importStatus, setImportStatus] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        file: null as File | null,
        classroom_id: '',
        semester_id: ''
    })

    const handleDownloadTemplate = () => {
        // Create CSV content
        const headers = 'name,nik,nis,gender,place_of_birth,date_of_birth,address,phone,email,guardian_email,enrollment_date\n'
        const example = 'John Doe,1234567890,1001,Male,Jakarta,2000-01-01,Jl. Contoh No. 1,081234567890,john@example.com,parent@example.com,2024-01-01'
        const csvContent = headers + example

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'template-import-siswa.csv'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        post(route('students.import'), {
            onSuccess: (response) => {
                toast({
                    title: 'Starting import...',
                    description: 'Your file is being processed.',
                })
                onOpenChange(false)
                reset()
            },
            onError: () => {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to import students',
                })
            }
        })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setData('file', e.target.files[0])
        }
    }

    const checkImportStatus = async () => {
        try {
            const response = await axios.get(`/api/import-status`);
            console.log('Checking import status:', response.data);

            if (response.data.success) {
                // Jika status ditemukan
                setImportStatus(response.data.data);
                toast({
                    title: 'Import Berhasil',
                    description: 'Data Siswa berhasil diimpor.',
                    variant: 'default',
                });
            } else {
                // Jika tidak ada status yang ditemukan
                setImportStatus(null); // Kosongkan status
                toast({
                    title: 'Informasi',
                    description: response.data.message, // Pesan "Tidak ditemukan impor baru-baru ini"
                    variant: 'default', // Ganti dengan varian yang sesuai
                });
            }
        } catch (error) {
            console.error('Error checking import status:', error);
            toast({
                title: 'Error',
                description: 'Terjadi kesalahan saat memeriksa status impor.',
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(val) => {
                onOpenChange(val)
                reset()
            }}
        >
            <DialogContent className='sm:max-w-md'>
                <DialogHeader className='space-y-4'>
                    <div>
                        <DialogTitle>Import Students</DialogTitle>
                        <DialogDescription>
                            Import students quickly from a CSV file.
                        </DialogDescription>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="outline" 
                            className="flex items-center w-full gap-2"
                            onClick={handleDownloadTemplate}
                        >
                            Download Template
                            <IconDownload className='w-4 h-4' />
                        </Button>
                        <Button 
                            variant="outline"
                            className="w-full"
                            onClick={checkImportStatus}
                        >
                            Check Import Status
                        </Button>
                    </div>
                </DialogHeader>

                <form id='student-import-form' onSubmit={onSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="file">File CSV</Label>
                            <Input
                                id="file"
                                type='file'
                                onChange={handleFileChange}
                                accept=".csv,text/csv"
                                className='h-9'
                            />
                            {errors.file && (
                                <p className="text-sm text-red-500">{errors.file}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="classroom">Kelas</Label>
                                <ComboboxForm
                                    value={data.classroom_id}
                                    onValueChange={(value) => setData('classroom_id', value)}
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

                            <div className="space-y-2">
                                <Label htmlFor="semester">Semester</Label>
                                <ComboboxForm
                                    value={data.semester_id}
                                    onValueChange={(value) => setData('semester_id', value)}
                                    options={semesters.map(semester => ({
                                        value: semester.id,
                                        label: semester.name ?? ""
                                    }))}
                                    placeholder="Pilih Semester"
                                    searchPlaceholder="Cari Semester..."
                                    emptyMessage="Semester tidak ditemukan."
                                    error={!!errors.semester_id}
                                    errorMessage={errors.semester_id}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant='outline'>Cancel</Button>
                        </DialogClose>
                        <Button
                            type='submit'
                            disabled={processing}
                        >
                            {processing ? 'Importing...' : 'Import'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
