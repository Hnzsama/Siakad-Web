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
import { StudentHistory, Exportable } from "../data/schema";
import { useResourceContext } from "../context/context";

interface ExportDropdownProps {
    data: StudentHistory[];
}

export function ExportDropdown({ data }: ExportDropdownProps) {
    const { permissions } = useResourceContext()

    const prepareDataForExport = (datas: ExportDropdownProps['data']): Exportable[] => {
        return datas.map(data => ({
            student_id: data.student_id,
            semester_id: data.semester_id,
            classroom_id: data.classroom_id,
            student: data.student,
            semester: data.semester,
            classroom: data.classroom
        }));
    };

    const headers = [
        'NIS',
        'Nama Siswa',
        'Kelas',
        'Semester',
        'Tahun Akademik',
        'Tipe Semester'
    ];

    const columns = [
        'student_id',
        'semester_id',
        'classroom_id'
    ];

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID');
    };

    const exportToCsv = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const csvRows = exportData.map(data => [
            data.student?.nis || '',
            data.student?.name || '',
            data.classroom?.name || '',
            data.semester?.name || '',
            data.semester?.academic_year || '',
            data.semester?.type === 'odd' ? 'Ganjil' : 'Genap'
        ].map(value =>
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(','));

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        downloadFile(csvContent, 'student-history.csv', 'text/csv');
    };

    const exportToExcel = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(exportData.map(data => ({
            'NIS': data.student?.nis || '',
            'Nama Siswa': data.student?.name || '',
            'Kelas': data.classroom?.name || '',
            'Semester': data.semester?.name || '',
            'Tahun Akademik': data.semester?.academic_year || '',
            'Tipe Semester': data.semester?.type === 'odd' ? 'Ganjil' : 'Genap'
        })));

        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Student History');

        XLSX.writeFile(workbook, 'student-history.xlsx');
    };

    const exportToSql = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const sqlStatements = data.map(item => {
            const values = [
                item.student_id,
                item.semester_id,
                item.classroom_id
            ].map(value => {
                if (value === null) return 'NULL';
                return `'${String(value).replace(/'/g, "''")}'`;
            });

            return `INSERT INTO student_history (${columns.join(', ')}) VALUES (${values.join(', ')});`;
        }).join('\n');

        downloadFile(sqlStatements, 'student-history.sql', 'text/plain');
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
