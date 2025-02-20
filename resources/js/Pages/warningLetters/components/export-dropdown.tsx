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
import { WarningLetter, Exportable } from "../data/schema";
import { useResourceContext } from "../context/context";

interface ExportDropdownProps {
    data: WarningLetter[];
}

export function ExportDropdown({ data }: ExportDropdownProps) {
    const { permissions } = useResourceContext();

    const prepareDataForExport = (letters: WarningLetter[]): Exportable[] => {
        return letters.map(letter => ({
            letter_number: letter.letter_number,
            student_id: letter.student_id,
            semester_id: letter.semester_id,
            warning_category_id: letter.warning_category_id,
            issued_date: letter.issued_date,
            description: letter.description,
            document_path: letter.document_path,
            parent_id: letter.parent_id,
            parent_received_at: letter.parent_received_at,
            parent_signature_path: letter.parent_signature_path,
            follow_up_date: letter.follow_up_date,
            follow_up_notes: letter.follow_up_notes,
            cancelled_at: letter.cancelled_at,
            cancellation_reason: letter.cancellation_reason,
            cancelled_by: letter.cancelled_by,
            cancellation_document_path: letter.cancellation_document_path,
            approved_by: letter.approved_by,
            created_by: letter.created_by,
            updated_by: letter.updated_by,
            created_at: letter.created_at,
            // Add status based on cancellation
            status: letter.cancelled_at ? 'cancelled' :
                   letter.approved_by ? 'approved' : 'pending',
            // Include relations data
            student: letter.student,
            semester: letter.semester,
            warning_category: letter.warning_category,
            parent: letter.parent,
            repellent: letter.repellent,
            approver: letter.approver,
            creator: letter.creator,
            updater: letter.updater
        }));
    };

    const headers = [
        'Nomor Surat',
        'Siswa',
        'NIS',
        'Semester',
        'Kategori SP',
        'Tanggal Terbit',
        'Deskripsi',
        'Wali Murid',
        'Tanggal Diterima',
        'Tanggal Tindak Lanjut',
        'Catatan Tindak Lanjut',
        'Status Pembatalan',
        'Alasan Pembatalan',
        'Dibatalkan Oleh',
        'Disetujui Oleh',
        'Dibuat Oleh',
        'Tanggal Dibuat'
    ];

    const exportToCsv = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const csvRows = exportData.map(letter => [
            letter.letter_number,
            letter.student.name,
            letter.student.nis,
            letter.semester.name,
            letter.warning_category.category_name,
            letter.issued_date,
            letter.description,
            letter.parent.name,
            letter.parent_received_at,
            letter.follow_up_date,
            letter.follow_up_notes,
            letter.cancelled_at ? 'Dibatalkan' : 'Aktif',
            letter.cancellation_reason,
            letter.repellent?.name,
            letter.approver?.name,
            letter.creator.name,
            letter.created_at
        ].map(value =>
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(','));

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        downloadFile(csvContent, 'surat-peringatan.csv', 'text/csv');
    };

    const exportToExcel = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(exportData.map(letter => ({
            'Nomor Surat': letter.letter_number,
            'Siswa': letter.student.name,
            'NIS': letter.student.nis,
            'Semester': letter.semester.name,
            'Kategori SP': letter.warning_category.category_name,
            'Tanggal Terbit': letter.issued_date,
            'Deskripsi': letter.description,
            'Wali Murid': letter.parent.name,
            'Tanggal Diterima': letter.parent_received_at,
            'Tanggal Tindak Lanjut': letter.follow_up_date,
            'Catatan Tindak Lanjut': letter.follow_up_notes,
            'Status Pembatalan': letter.cancelled_at ? 'Dibatalkan' : 'Aktif',
            'Alasan Pembatalan': letter.cancellation_reason,
            'Dibatalkan Oleh': letter.repellent?.name,
            'Disetujui Oleh': letter.approver?.name,
            'Dibuat Oleh': letter.creator.name,
            'Tanggal Dibuat': letter.created_at
        })));

        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Surat Peringatan');

        XLSX.writeFile(workbook, 'surat-peringatan.xlsx');
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
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
