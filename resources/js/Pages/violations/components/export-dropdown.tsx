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
import { Violation, Exportable } from "../data/schema";
import { useResourceContext } from "../context/context";
import { format } from "date-fns";

interface ExportDropdownProps {
    data: Violation[];
}

export function ExportDropdown({ data }: ExportDropdownProps) {
    const { permissions } = useResourceContext();

    const prepareDataForExport = (items: Violation[]): Exportable[] => {
        return items.map(item => ({
            'Nama Siswa': item.student.name,
            'NIS': item.student.nis,
            'Semester': item.semester.name,
            'Jenis Pelanggaran': item.violation_type.name,
            'Tanggal Pelanggaran': format(new Date(item.violation_date), 'dd MMMM yyyy'),
            'Status': item.status === 'approved' ? 'Disetujui' : item.status === 'cancelled' ? 'Dibatalkan' : 'Menunggu',
            'Deskripsi': item.description,
            'Catatan Sanksi': item.sanction_notes ?? '-',
            'Tanggal Mulai Sanksi': item.sanction_start_date ? format(new Date(item.sanction_start_date), 'dd MMMM yyyy') : '-',
            'Tanggal Selesai Sanksi': item.sanction_end_date ? format(new Date(item.sanction_end_date), 'dd MMMM yyyy') : '-',
            'Dibuat Oleh': item.creator.name,
            'Disetujui Oleh': item.approver?.name ?? '-',
            'Dibatalkan Oleh': item.canceller?.name ?? '-',
            'Alasan Pembatalan': item.cancellation_reason ?? '-',
        }));
    };

    const headers = [
        'Nama Siswa',
        'NIS',
        'Semester',
        'Jenis Pelanggaran',
        'Tanggal Pelanggaran',
        'Status',
        'Deskripsi',
        'Catatan Sanksi',
        'Tanggal Mulai Sanksi',
        'Tanggal Selesai Sanksi',
        'Dibuat Oleh',
        'Disetujui Oleh',
        'Dibatalkan Oleh',
        'Alasan Pembatalan'
    ];

    const exportToCsv = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const csvRows = exportData.map(item => Object.values(item).map(value =>
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(','));

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        downloadFile(csvContent, 'pelanggaran.csv', 'text/csv');
    };

    const exportToExcel = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Pelanggaran');
        XLSX.writeFile(workbook, 'pelanggaran.xlsx');
    };

    const exportToSql = () => {
        if (data.length === 0) return;

        const sqlStatements = data.map(item => {
            const values = [
                item.student_id,
                item.semester_id,
                item.violation_type_id,
                item.violation_date,
                item.description,
                item.document_path,
                item.status,
                item.approved_by,
                item.cancelled_at,
                item.cancellation_reason,
                item.cancelled_by,
                item.sanction_start_date,
                item.sanction_end_date,
                item.sanction_notes,
                item.created_by,
                item.updated_by,
            ].map(value => {
                if (value === null || value === undefined) return 'NULL';
                return `'${String(value).replace(/'/g, "''")}'`;
            });

            const columns = [
                'student_id',
                'semester_id',
                'violation_type_id',
                'violation_date',
                'description',
                'document_path',
                'status',
                'approved_by',
                'cancelled_at',
                'cancellation_reason',
                'cancelled_by',
                'sanction_start_date',
                'sanction_end_date',
                'sanction_notes',
                'created_by',
                'updated_by'
            ];

            return `INSERT INTO violations (${columns.join(', ')}) VALUES (${values.join(', ')});`;
        }).join('\n');

        downloadFile(sqlStatements, 'pelanggaran.sql', 'text/plain');
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
