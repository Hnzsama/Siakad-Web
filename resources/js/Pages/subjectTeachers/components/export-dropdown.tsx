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
import { SubjectTeacher, Exportable } from "../data/schema";
import { useResourceContext } from "../context/context";

interface ExportDropdownProps {
    data: SubjectTeacher[];
}

export function ExportDropdown({ data }: ExportDropdownProps) {
    const { permissions } = useResourceContext()

    const prepareDataForExport = (datas: ExportDropdownProps['data']): Exportable[] => {
        return datas.map(data => ({
            subject_id: data.subject_id,
            teacher_id: data.teacher_id,
            subject: data.subject,
            teacher: data.teacher,
            created_at: data.created_at,
        }));
    };

    const exportToCsv = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const headers = ['Mata Pelajaran', 'Guru', 'Dibuat Pada'];
        const csvRows = exportData.map(item => [
            item.subject.name,
            item.teacher.name,
            item.created_at
        ].map(value =>
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(','));

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        downloadFile(csvContent, 'guru_mata_pelajaran.csv', 'text/csv');
    };

    const exportToExcel = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(exportData.map(item => ({
            mata_pelajaran: item.subject.name,
            guru: item.teacher.name,
            dibuat_pada: item.created_at,
        })));
        XLSX.utils.sheet_add_aoa(worksheet, [['Mata Pelajaran', 'Guru', 'Dibuat Pada']], { origin: 'A1' });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'GuruMataPelajaran');

        XLSX.writeFile(workbook, 'guru_mata_pelajaran.xlsx');
    };

    const exportToSql = () => {
        const exportData = data; // Use original data for SQL export
        if (exportData.length === 0) return;

        const sqlStatements = exportData.map(item => {
            const values = [
                item.subject_id,
                item.teacher_id,
                item.created_at
            ].map(value => value === null ? 'NULL' : `'${String(value).replace(/'/g, "''")}'`);

            return `INSERT INTO subject_teachers (subject_id, teacher_id, created_at) VALUES (${values.join(', ')});`;
        }).join('\n');

        downloadFile(sqlStatements, 'guru_mata_pelajaran.sql', 'text/plain');
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
