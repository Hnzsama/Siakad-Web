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
import { Exportable, School } from "../data/schema"
import * as XLSX from 'xlsx';
import { useResourceContext } from "../context/context";

interface ExportDropdownProps {
    data: (School & {
        province: { name: string }
        regency: { name: string }
        district: { name: string }
    })[]
}

export function ExportDropdown({ data }: ExportDropdownProps) {
    const { permissions } = useResourceContext()

    const prepareDataForExport = (schools: ExportDropdownProps['data']): Exportable[] => {
        return schools.map(school => {
            // Split address to remove embedded province and postal code
            const addressParts = school.address.split(',')
            const cleanAddress = addressParts[0].trim() // Take only the street address part

            return {
                name: school.name,
                npsn: school.npsn,
                schoolLevel: school.schoolLevel,
                address: cleanAddress,
                province: school.province.name,
                regency: school.regency.name,
                district: school.district.name,
                postal_code: school.postal_code,
                status: school.status
            }
        })
    }

    const exportToCsv = () => {
        const exportData = prepareDataForExport(data)
        if (exportData.length === 0) return

        // Define fixed headers to ensure correct mapping
        const headers = [
            'Name',
            'NPSN',
            'School Level',
            'Address',
            'Province',
            'Regency',
            'District',
            'Postal Code',
            'Status'
        ]

        const csvRows = exportData.map(school => ([
            school.name,
            school.npsn,
            school.schoolLevel,
            school.address,
            school.province,
            school.regency,
            school.district,
            school.postal_code,
            school.status ? 'Aktif' : 'Tidak Aktif'
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
            'NPSN',
            'School Level',
            'Address',
            'Province',
            'Regency',
            'District',
            'Postal Code',
            'Status',
        ];
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
            'name',
            'npsn',
            'school_level',
            'address',
            'province',
            'regency',
            'district',
            'postal_code',
            'status'
        ]

        const sqlStatements = exportData.map(school => {
            const values = [
                school.name,
                school.npsn,
                school.schoolLevel,
                school.address,
                school.province,
                school.regency,
                school.district,
                school.postal_code,
                school.status ? 1 : 0
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
