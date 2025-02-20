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
import { WarningCategory, Exportable } from "../data/schema";
import { useResourceContext } from "../context/context";

interface ExportDropdownProps {
    data: WarningCategory[];
}

export function ExportDropdown({ data }: { data: WarningCategory[] }) {
    const { permissions } = useResourceContext()

    const prepareDataForExport = (datas: WarningCategory[]): Exportable[] => {
        return datas.map(data => ({
            category_name: data.category_name,
            description: data.description,
            level: data.level,
            warnings_count: data.warnings_count
        }));
    };

    const headers = [
        'Nama Kategori',
        'Level',
        'Deskripsi'
    ];

    const columns = [
        'category_name',
        'level',
        'description'
    ];

    const exportToCsv = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const csvRows = exportData.map(data => [
            data.category_name,
            `SP${data.level}`,
            data.description ?? ''
        ].map(value =>
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(','));

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        downloadFile(csvContent, 'warning-categories.csv', 'text/csv');
    };

    const exportToExcel = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(exportData.map(data => ({
            'Nama Kategori': data.category_name,
            'Level': `SP${data.level}`,
            'Deskripsi': data.description ?? ''
        })));

        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Warning Categories');

        XLSX.writeFile(workbook, 'warning-categories.xlsx');
    };

    const exportToSql = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const sqlStatements = data.map(item => {
            const values = [
                item.category_name,
                item.description,
                item.level
            ].map(value => {
                if (value === null) return 'NULL';
                return `'${String(value).replace(/'/g, "''")}'`;
            });

            return `INSERT INTO warning_categories (${columns.join(', ')}) VALUES (${values.join(', ')});`;
        }).join('\n');

        downloadFile(sqlStatements, 'warning-categories.sql', 'text/plain');
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
