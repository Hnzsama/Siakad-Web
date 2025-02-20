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
import { LeaveRequest, Exportable } from "../data/schema";
import { useResourceContext } from "../context/context";
import { format } from "date-fns";

interface ExportDropdownProps {
    data: LeaveRequest[];
}

export function ExportDropdown({ data }: ExportDropdownProps) {
    const { permissions } = useResourceContext();

    const prepareDataForExport = (items: LeaveRequest[]): Exportable[] => {
        return items.map(item => ({
            leavable_id: item.leavable_id,
            leavable_type: item.leavable_type,
            semester_id: item.semester_id,
            leave_type_id: item.leave_type_id,
            start_date: format(new Date(item.start_date), 'yyyy-MM-dd'),
            end_date: format(new Date(item.end_date), 'yyyy-MM-dd'),
            reason: item.reason,
            attachment_url: item.attachment_url,
            status: item.status,
            approved_by: item.approved_by,
            rejected_at: item.rejected_at,
            rejection_reason: item.rejection_reason,
            rejected_by: item.rejected_by,
            created_at: item.created_at,
            updated_at: item.updated_at,
            leavable: {
                id: item.leavable.id,
                name: item.leavable.name,
                nis: 'nis' in item.leavable ? item.leavable.nis : undefined,
                nip: 'nip' in item.leavable ? item.leavable.nip : undefined,
            },
            semester: item.semester,
            leave_type: item.leave_type,
            approver_name: item.approver?.name ?? null,
            repellent_name: item.repellent?.name ?? null
        }));
    };

    const headers = [
        'ID Pemohon',
        'Tipe Pemohon',
        'Semester',
        'Tipe Cuti',
        'Tanggal Mulai',
        'Tanggal Selesai',
        'Alasan',
        'Lampiran',
        'Status',
        'Disetujui Oleh',
        'Tanggal Ditolak',
        'Alasan Penolakan',
        'Ditolak Oleh',
        'Dibuat Pada',
        'Diperbarui Pada',
        'Nama Pemohon',
        'ID/NIP Pemohon',
        'Semester',
        'Tipe Cuti',
        'Nama Penyetuju',
        'Nama Penolak'
    ];

    const columns = [
        'leavable_id',
        'leavable_type',
        'semester_id',
        'leave_type_id',
        'start_date',
        'end_date',
        'reason',
        'attachment_url',
        'status',
        'approved_by',
        'rejected_at',
        'rejection_reason',
        'rejected_by',
        'created_at',
        'updated_at',
        'leavable.name',
        ['leavable.nis', 'leavable.nip'],
        'semester.name',
        'leave_type.leave_name',
        'approver.name',
        'repellent.name'
    ];

    const exportToCsv = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const csvRows = exportData.map(item => [
            item.leavable_id,
            item.leavable_type,
            item.semester_id,
            item.leave_type_id,
            item.start_date,
            item.end_date,
            item.reason,
            item.attachment_url,
            item.status,
            item.approved_by ?? '',
            item.rejected_at ?? '',
            item.rejection_reason ?? '',
            item.rejected_by ?? '',
            item.created_at,
            item.updated_at,
            item.leavable.name,
            item.leavable.nis || item.leavable.nip,
            item.semester.name,
            item.leave_type.leave_name,
            item.approver_name,
            item.repellent_name
        ].map(value =>
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(','));

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        downloadFile(csvContent, 'leave-requests.csv', 'text/csv');
    };

    const exportToExcel = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(exportData.map(item => ({
            'ID Pemohon': item.leavable_id,
            'Tipe Pemohon': item.leavable_type,
            'Semester ID': item.semester_id,
            'Tipe Cuti ID': item.leave_type_id,
            'Tanggal Mulai': item.start_date,
            'Tanggal Selesai': item.end_date,
            'Alasan': item.reason,
            'Lampiran': item.attachment_url,
            'Status': item.status,
            'Disetujui Oleh': item.approved_by,
            'Tanggal Ditolak': item.rejected_at,
            'Alasan Penolakan': item.rejection_reason,
            'Ditolak Oleh': item.rejected_by,
            'Dibuat Pada': item.created_at,
            'Diperbarui Pada': item.updated_at,
            'Nama Pemohon': item.leavable.name,
            'ID/NIP Pemohon': item.leavable.nis || item.leavable.nip,
            'Semester': item.semester.name,
            'Tipe Cuti': item.leave_type.leave_name,
            'Nama Penyetuju': item.approver_name ?? '',
            'Nama Penolak': item.repellent_name ?? '',
        })));

        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Leave Requests');
        XLSX.writeFile(workbook, 'leave-requests.xlsx');
    };

    const exportToSql = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const sqlStatements = data.map(item => {
            const values = [
                item.leavable_id,
                item.leavable_type,
                item.semester_id,
                item.leave_type_id,
                item.start_date,
                item.end_date,
                item.reason,
                item.attachment_url,
                item.status,
                item.approved_by,
                item.rejected_at,
                item.rejection_reason,
                item.rejected_by,
                item.created_at,
                item.updated_at
            ].map(value => {
                if (value === null) return 'NULL';
                return typeof value === 'boolean'
                    ? value ? 'true' : 'false'
                    : `'${String(value).replace(/'/g, "''")}'`;
            }).join(', ');

            return `INSERT INTO leave_requests (${columns.slice(0, 15).join(', ')}) VALUES (${values});`;
        }).join('\n');

        downloadFile(sqlStatements, 'leave-requests.sql', 'text/plain');
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
                    <IconDownload className="w-4 h-4" />
                    <span>Ekspor</span>
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
