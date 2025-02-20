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
import { User } from "../data/schema"
import * as XLSX from 'xlsx';
import { useResourceContext } from "../context/context";

type Exportable = {
    name: string
    email: string,
    phone: string,
    status: boolean,
    created_at: string
}

interface ExportDropdownProps {
    data: ( User )[]
}

export function ExportDropdown({ data }: ExportDropdownProps) {
    const { permissions } = useResourceContext()

    const prepareDataForExport = (datas: ExportDropdownProps['data']): Exportable[] => {
        return datas.map(data => {

            return {
                name: data.name,
                email: data.email,
                phone: data.phone ?? '',
                status: data.status,
                created_at: data.created_at
            }
        })
    }

    const exportToCsv = () => {
        const exportData = prepareDataForExport(data)
        if (exportData.length === 0) return

        const headers = [
            'Name',
            'Email',
            'Phone',
            'Status',
            'Created_at'
        ]

        const csvRows = exportData.map(data => ([
            data.name,
            data.email,
            data.phone,
            data.status ? 'Aktif' : 'Tidak Aktif',
            data.created_at
        ].map(value =>
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(','))
        )

        const csvContent = [headers.join(','), ...csvRows].join('\n')
        downloadFile(csvContent, 'schools.csv', 'text/csv')
    }

    const exportToExcel = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        // Buat worksheet dari data
        const worksheet = XLSX.utils.json_to_sheet(exportData);

        // Tambahkan judul kolom secara eksplisit (opsional)
        const headers = [
            'Name',
            'Email',
            'Phone',
            'Status',
            'Created_at'
        ]
        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

        // Buat workbook dan tambahkan worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Schools');

        // Ekspor ke file
        XLSX.writeFile(workbook, 'schools.xlsx');
    };

    const exportToSql = () => {
        const exportData = prepareDataForExport(data)
        if (exportData.length === 0) return

        const columns = [
            'Name',
            'Email',
            'Phone',
            'Status',
            'Created_at'
        ]

        const sqlStatements = exportData.map(data => {
            const values = [
                data.name,
                data.email,
                data.phone,
                data.status ? 'Aktif' : 'Tidak Aktif',
                data.created_at
            ].map(value => {
                if (value === null) return 'NULL'
                if (typeof value === 'boolean') return value ? 1 : 0
                if (typeof value === 'number') return value
                return `'${String(value).replace(/'/g, "''")}'`
            })

            return `INSERT INTO schools (${columns.join(', ')}) VALUES (${values.join(', ')});`
        }).join('\n')

        downloadFile(sqlStatements, 'schools.sql', 'text/plain')
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
