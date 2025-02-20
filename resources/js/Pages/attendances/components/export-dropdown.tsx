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
import { Attendance, Exportable } from "../data/schema";
import { format, parse } from "date-fns";
import { useResourceContext } from "../context/context";

interface ExportDropdownProps {
    data: Attendance[];
}

export function ExportDropdown({ data }: ExportDropdownProps) {
    const { permissions } = useResourceContext()

    const prepareDataForExport = (datas: Attendance[]): Exportable[] => {
        return datas.map(({ id, updated_at, selectedIds, ...rest }) => ({
            ...rest,
            created_at: format(new Date(rest.created_at), 'yyyy-MM-dd HH:mm:ss'),
            date: format(new Date(rest.date), 'yyyy-MM-dd'),
            check_in: rest.check_in ? format(new Date(`1970-01-01T${rest.check_in}Z`), 'hh:mm a') : '-',
            check_out: rest.check_out ? format(new Date(`1970-01-01T${rest.check_out}Z`), 'hh:mm a') : '-',
        }));
    };

    const exportToCsv = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const headers = [
            'Tanggal',
            'Nama',
            'NIS/NIP',
            'Tipe',
            'Jam Masuk',
            'Jam Keluar',
            'Status',
            'Latitude',
            'Longitude',
            'Info Perangkat',
            'Catatan',
            'Dibuat Pada',
        ];

        const csvRows = exportData.map(data => [
            data.date,
            data.attendable?.name || '-',
            'nis' in data.attendable ? data.attendable.nis : data.attendable.nip,
            data.attendable_type === 'App\\Models\\Student' ? 'Siswa' : 'Guru',
            data.check_in || '-',
            data.check_out || '-',
            data.status,
            data.location_latitude || '-',
            data.location_longitude || '-',
            data.device_info || '-',
            data.notes || '-',
            data.created_at
        ].map(value =>
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(','));

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        downloadFile(csvContent, 'attendance.csv', 'text/csv');
    };

    const exportToExcel = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const excelData = exportData.map(data => ({
            'Tanggal': data.date,
            'Nama': data.attendable?.name || '-',
            'NIS/NIP': 'nis' in data.attendable ? data.attendable.nis : data.attendable.nip,
            'Tipe': data.attendable_type === 'App\\Models\\Student' ? 'Siswa' : 'Guru',
            'Jam Masuk': data.check_in || '-',
            'Jam Keluar': data.check_out || '-',
            'Status': data.status,
            'Latitude': data.location_latitude || '-',
            'Longitude': data.location_longitude || '-',
            'Info Perangkat': data.device_info || '-',
            'Catatan': data.notes || '-',
            'Dibuat Pada': data.created_at
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

        XLSX.writeFile(workbook, 'attendance.xlsx');
    };

    const exportToSql = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const columns = [
            'attendable_id',
            'attendable_type',
            'semester_id',
            'date',
            'check_in',
            'check_out',
            'status',
            'location_latitude',
            'location_longitude',
            'device_info',
            'photo_path',
            'notes',
            'created_at'
        ];

        const sqlStatements = exportData.map(data => {
            const values = [
                `'${data.attendable_id}'`,
                `'${data.attendable_type}'`,
                `'${data.semester_id}'`,
                `'${data.date}'`,
                data.check_in ? `'${data.check_in}'` : 'NULL',
                data.check_out ? `'${data.check_out}'` : 'NULL',
                `'${data.status}'`,
                data.location_latitude ? `'${data.location_latitude}'` : 'NULL',
                data.location_longitude ? `'${data.location_longitude}'` : 'NULL',
                data.device_info ? `'${data.device_info.replace(/'/g, "''")}'` : 'NULL',
                data.photo_path ? `'${data.photo_path}'` : 'NULL',
                data.notes ? `'${data.notes.replace(/'/g, "''")}'` : 'NULL',
                `'${data.created_at}'`
            ];

            return `INSERT INTO attendances (${columns.join(', ')}) VALUES (${values.join(', ')});`;
        }).join('\n');

        downloadFile(sqlStatements, 'attendance.sql', 'text/plain');
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
