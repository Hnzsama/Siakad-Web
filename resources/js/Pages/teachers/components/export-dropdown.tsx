import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconDownload } from "@tabler/icons-react"
import * as XLSX from 'xlsx';
import { Exportable, Teacher } from "../data/schema";
import { useResourceContext } from "../context/context";

interface ExportDropdownProps {
    data: Teacher[]
}

export function ExportDropdown({ data }: ExportDropdownProps) {
    const { permissions } = useResourceContext()

    const prepareDataForExport = (datas: ExportDropdownProps['data']): Exportable[] => {
        return datas.map(data => {
            return {
                name: data.name,
                nip: data.nip,
                gender: data.gender,
                place_of_birth: data.place_of_birth,
                date_of_birth: data.date_of_birth,
                highest_education: data.highest_education,
                major: data.major,
                university: data.university,
                certification: data.certification,
                address: data.address,
                phone: data.phone,
                email: data.email,
                position: data.position,
                subject: data.subject,
                year_started: data.year_started,
                year_ended: data.year_ended,
                work_experience: data.work_experience,
                status: data.status,
                created_at: data.created_at
            }
        })
    }

    const translateGender = (gender: 'Male' | 'Female'): string => {
        return gender === 'Male' ? 'Laki-laki' : 'Perempuan'
    }

    const exportToCsv = () => {
        const exportData = prepareDataForExport(data)
        if (exportData.length === 0) return

        const headers = [
            'Nama',
            'NIP',
            'Jenis Kelamin',
            'Tempat Lahir',
            'Tanggal Lahir',
            'Pendidikan Terakhir',
            'Jurusan',
            'Universitas',
            'Sertifikasi',
            'Alamat',
            'No. Telepon',
            'Email',
            'Jabatan',
            'Mata Pelajaran',
            'Tahun Mulai',
            'Tahun Selesai',
            'Pengalaman Kerja',
            'Status',
            'Dibuat Pada'
        ]

        const csvRows = exportData.map(data => ([
            data.name,
            data.nip,
            translateGender(data.gender),
            data.place_of_birth,
            data.date_of_birth,
            data.highest_education || '',
            data.major || '',
            data.university || '',
            data.certification || '',
            data.address,
            data.phone || '',
            data.email,
            data.position || '',
            data.subject || '',
            data.year_started,
            data.year_ended || '',
            data.work_experience || '',
            data.status ? 'Aktif' : 'Nonaktif',
            data.created_at
        ].map(value =>
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(','))
        )

        const csvContent = [headers.join(','), ...csvRows].join('\n')
        downloadFile(csvContent, 'teachers.csv', 'text/csv')
    }

    const exportToExcel = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(exportData);

        const headers = [
            'Nama',
            'NIP',
            'Jenis Kelamin',
            'Tempat Lahir',
            'Tanggal Lahir',
            'Pendidikan Terakhir',
            'Jurusan',
            'Universitas',
            'Sertifikasi',
            'Alamat',
            'No. Telepon',
            'Email',
            'Jabatan',
            'Mata Pelajaran',
            'Tahun Mulai',
            'Tahun Selesai',
            'Pengalaman Kerja',
            'Status',
            'Dibuat Pada'
        ]
        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Teachers');

        XLSX.writeFile(workbook, 'teachers.xlsx');
    };

    const exportToSql = () => {
        const exportData = prepareDataForExport(data)
        if (exportData.length === 0) return

        const columns = [
            'name',
            'nip',
            'gender',
            'place_of_birth',
            'date_of_birth',
            'highest_education',
            'major',
            'university',
            'certification',
            'address',
            'phone',
            'email',
            'position',
            'subject',
            'year_started',
            'year_ended',
            'work_experience',
            'status',
            'created_at'
        ]

        const sqlStatements = exportData.map(data => {
            const values = [
                data.name,
                data.nip,
                data.gender,
                data.place_of_birth,
                data.date_of_birth,
                data.highest_education,
                data.major,
                data.university,
                data.certification,
                data.address,
                data.phone,
                data.email,
                data.position,
                data.subject,
                data.year_started,
                data.year_ended,
                data.work_experience,
                data.status,
                data.created_at
            ].map(value => {
                if (value === null) return 'NULL'
                return `'${String(value).replace(/'/g, "''")}'`
            })

            return `INSERT INTO teachers (${columns.join(', ')}) VALUES (${values.join(', ')});`
        }).join('\n')

        downloadFile(sqlStatements, 'teachers.sql', 'text/plain')
    }

    const downloadFile = (content: string, filename: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='outline'
                    className='space-x-1'
                    hidden={!permissions.export}
                >
                    <span>Ekspor</span> <IconDownload size={18} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ekspor Sebagai</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={exportToCsv}>
                    CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToExcel}>
                    Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToSql}>
                    SQL
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
