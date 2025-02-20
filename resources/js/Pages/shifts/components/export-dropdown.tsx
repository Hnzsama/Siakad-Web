import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDownload } from "@tabler/icons-react";
import * as XLSX from 'xlsx';
import { Shift, Exportable } from "../data/schema";
import { useResourceContext } from "../context/context";

interface ExportDropdownProps {
    data: Shift[];
}

export function ExportDropdown({ data }: ExportDropdownProps) {
    const { permissions } = useResourceContext()

    const prepareDataForExport = (datas: ExportDropdownProps['data']): Exportable[] => {
        return datas.map(data => ({
            name: data.name,
            status: data.status ? 'Aktif' : 'Nonaktif',
            created_at: data.created_at,
        }));
    };

    const exportToCsv = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const headers = [
            'Nama Shift',
            'Status',
            'Dibuat Pada',
        ];

        const csvRows = exportData.map(data => [
            data.name,
            data.status,
            data.created_at
        ].map(value =>
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(','));

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        downloadFile(csvContent, 'shifts.csv', 'text/csv');
    };

    const exportToExcel = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(exportData);

        const headers = [
            'Nama Shift',
            'Waktu Mulai',
            'Waktu Selesai',
            'Status',
            'Dibuat Pada',
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Shifts');

        XLSX.writeFile(workbook, 'shifts.xlsx');
    };

    const exportToSql = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const columns = [
            'name',
            'start_time',
            'end_time',
            'status',
            'created_at',
        ];

        const sqlStatements = exportData.map(data => {
            const values = [
                data.name,
                data.status,
                data.created_at
            ].map(value => value === null ? 'NULL' : `'${String(value).replace(/'/g, "''")}'`);

            return `INSERT INTO shifts (${columns.join(', ')}) VALUES (${values.join(', ')});`;
        }).join('\n');

        downloadFile(sqlStatements, 'shifts.sql', 'text/plain');
    };

    const downloadFile = (content: string, filename: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline' className='space-x-1' hidden={!permissions.export}>
                    <span>Ekspor</span> <IconDownload size={18} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ekspor Sebagai</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={exportToCsv}>CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={exportToExcel}>Excel</DropdownMenuItem>
                <DropdownMenuItem onClick={exportToSql}>SQL</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
