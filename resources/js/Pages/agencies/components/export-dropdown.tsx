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
import { Agency, Exportable } from "../data/schema";
import { format } from "date-fns";
import { useResourceContext } from "../context/context";

interface ExportDropdownProps {
    data: Agency[];
}

export function ExportDropdown({ data }: ExportDropdownProps) {
    const { permissions } = useResourceContext()

    const prepareDataForExport = (datas: Agency[]): Exportable[] => {
        return datas.map(({ id, updated_at, selectedIds, ...rest }) => ({
            ...rest,
            created_at: format(new Date(rest.created_at), 'yyyy-MM-dd HH:mm:ss'),
        }));
    };

    const exportToCsv = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const headers = [
            'Nama Agency',
            'Nama',
            'Alamat',
            'Longitude',
            'Latitude',
            'Tipe Agency',
            'ID Agency',
            'Status',
            'Dibuat Pada',
        ];

        const csvRows = exportData.map(data => [
            data.name,
            data.agencyable?.name || '-',
            data.address,
            data.longitude,
            data.latitude,
            data.agencyable_type,
            data.agencyable_id,
            data.status ? 'Aktif' : 'Nonaktif',
            data.created_at
        ].map(value =>
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(','));

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        downloadFile(csvContent, 'agencies.csv', 'text/csv');
    };

    const exportToExcel = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        // Transform data for Excel to match headers
        const excelData = exportData.map(data => ({
            'Nama Agency': data.name,
            'Nama': data.agencyable?.name || '-',
            'Alamat': data.address,
            'Longitude': data.longitude,
            'Latitude': data.latitude,
            'Tipe Agency': data.agencyable_type,
            'ID Agency': data.agencyable_id,
            'Status': data.status ? 'Aktif' : 'Nonaktif',
            'Dibuat Pada': data.created_at
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Agencies');

        XLSX.writeFile(workbook, 'agencies.xlsx');
    };

    const exportToSql = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const columns = [
            'name',
            'address',
            'longitude',
            'latitude',
            'agencyable_type',
            'agencyable_id',
            'status',
            'created_at'
        ];

        const sqlStatements = exportData.map(data => {
            const values = [
                `'${data.name.replace(/'/g, "''")}'`,
                `'${data.address.replace(/'/g, "''")}'`,
                `'${data.longitude}'`,
                `'${data.latitude}'`,
                `'${data.agencyable_type}'`,
                `'${data.agencyable_id}'`,
                data.status ? '1' : '0',
                `'${data.created_at}'`
            ];

            return `INSERT INTO agencies (${columns.join(', ')}) VALUES (${values.join(', ')});`;
        }).join('\n');

        downloadFile(sqlStatements, 'agencies.sql', 'text/plain');
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
