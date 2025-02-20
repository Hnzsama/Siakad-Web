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
import { LeaveType, Exportable } from "../data/schema";
import { useResourceContext } from "../context/context";

interface ExportDropdownProps {
    data: LeaveType[];
}

export function ExportDropdown({ data }: ExportDropdownProps) {
    const { permissions } = useResourceContext();

    const prepareDataForExport = (items: LeaveType[]): Exportable[] => {
        return items.map(item => ({
            leave_name: item.leave_name,
            description: item.description ?? '',
        }));
    };

    const headers = [
        'Nama Cuti',
        'Deskripsi',
    ];

    const columns = [
        'leave_name',
        'description',
    ];

    const exportToCsv = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const csvRows = exportData.map(item => [
            item.leave_name,
            item.description,
        ].map(value =>
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(','));

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        downloadFile(csvContent, 'leave-types.csv', 'text/csv');
    };

    const exportToExcel = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(exportData.map(item => ({
            'Nama Cuti': item.leave_name,
            'Deskripsi': item.description,
        })));

        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Leave Types');

        XLSX.writeFile(workbook, 'leave-types.xlsx');
    };

    const exportToSql = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const sqlStatements = data.map(item => {
            const values = [
                item.leave_name,
                item.description,
            ].map(value => {
                if (value === null) return 'NULL';
                return typeof value === 'boolean'
                    ? value ? 'true' : 'false'
                    : `'${String(value).replace(/'/g, "''")}'`;
            });

            return `INSERT INTO leave_types (${columns.join(', ')}) VALUES (${values.join(', ')});`;
        }).join('\n');

        downloadFile(sqlStatements, 'leave-types.sql', 'text/plain');
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
                <Button variant="outline" className="space-x-1" hidden={!permissions.export}>
                    <span>Ekspor</span> <IconDownload className="w-4 h-4" />
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

export default ExportDropdown;
