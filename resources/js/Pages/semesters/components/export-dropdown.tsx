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
import { Exportable, Semester } from "../data/schema";
import { useResourceContext } from "../context/context";

interface ExportDropdownProps {
    data: Semester[]
}

export function ExportDropdown({ data }: ExportDropdownProps) {
    const { permissions } = useResourceContext()

    const prepareDataForExport = (datas: ExportDropdownProps['data']): Exportable[] => {
        return datas.map(data => {
            return {
                name: data.name,
                type: data.type,
                academic_year: data.academic_year,
                start_date: data.start_date,
                end_date: data.end_date,
                description: data.description,
                status: data.status,
                created_at: data.created_at
            }
        })
    }

    const translateStatus = (status: 'active' | 'completed' | 'pending'): string => {
        const statusMap = {
            active: 'Aktif',
            completed: 'Selesai',
            pending: 'Menunggu'
        }
        return statusMap[status]
    }

    const exportToCsv = () => {
        const exportData = prepareDataForExport(data)
        if (exportData.length === 0) return

        const headers = [
            'Nama',
            'Tipe',
            'Tahun Akademik',
            'Tanggal Mulai',
            'Tanggal Selesai',
            'Deskripsi',
            'Status',
            'Dibuat Pada'
        ]

        const csvRows = exportData.map(data => ([
            data.name,
            data.type === 'odd' ? 'Ganjil' : 'Genap',
            data.academic_year,
            data.start_date,
            data.end_date,
            data.description || '',
            translateStatus(data.status),
            data.created_at
        ].map(value =>
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(','))
        )

        const csvContent = [headers.join(','), ...csvRows].join('\n')
        downloadFile(csvContent, 'semesters.csv', 'text/csv')
    }

    const exportToExcel = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(exportData);

        const headers = [
            'Nama',
            'Tipe',
            'Tahun Akademik',
            'Tanggal Mulai',
            'Tanggal Selesai',
            'Deskripsi',
            'Status',
            'Dibuat Pada'
        ]
        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Semesters');

        XLSX.writeFile(workbook, 'semesters.xlsx');
    };

    const exportToSql = () => {
        const exportData = prepareDataForExport(data)
        if (exportData.length === 0) return

        const columns = [
            'name',
            'type',
            'academic_year',
            'start_date',
            'end_date',
            'description',
            'status',
            'created_at'
        ]

        const sqlStatements = exportData.map(data => {
            const values = [
                data.name,
                data.type,
                data.academic_year,
                data.start_date,
                data.end_date,
                data.description,
                data.status,
                data.created_at
            ].map(value => {
                if (value === null) return 'NULL'
                return `'${String(value).replace(/'/g, "''")}'`
            })

            return `INSERT INTO semesters (${columns.join(', ')}) VALUES (${values.join(', ')});`
        }).join('\n')

        downloadFile(sqlStatements, 'semesters.sql', 'text/plain')
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
