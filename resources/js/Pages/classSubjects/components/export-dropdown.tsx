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
import { ClassSubject, Exportable } from "../data/schema";
import { format } from "date-fns";
import { useResourceContext } from "../context/context";

interface ExportDropdownProps {
    data: ClassSubject[];
}

export function ExportDropdown({ data }: ExportDropdownProps) {
    const { permissions } = useResourceContext()

    const prepareDataForExport = (datas: ExportDropdownProps['data']): Exportable[] => {
        return datas.map(data => ({
            subject_teacher_id: data.subject_teacher_id,
            classroom_id: data.classroom_id,
            day: data.day,
            start_time: data.start_time,
            end_time: data.end_time,
            status: data.status,
            classroom: data.classroom,
            subject_teacher: data.subject_teacher,
            created_at: format(new Date(data.created_at), 'yyyy-MM-dd HH:mm:ss'),
        }));
    };

    const exportToCsv = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const headers = [
            'Guru',
            'Kelas',
            'Mata Pelajaran',
            'Hari',
            'Waktu Mulai',
            'Waktu Selesai',
            'Status',
            'Dibuat Pada'
        ];

        const csvRows = exportData.map(data => [
            data.subject_teacher?.teacher?.name ?? 'No Teacher',
            data.classroom?.name,
            data.subject_teacher?.subject?.name ?? 'No Subject',
            data.day,
            data.start_time,
            data.end_time,
            data.status ? 'Aktif' : 'Nonaktif',
            data.created_at
        ].map(value =>
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(','));

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        downloadFile(csvContent, 'class_subjects.csv', 'text/csv');
    };

    const exportToExcel = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.sheet_add_aoa(worksheet, [
            [
                'Guru',
                'Kelas',
                'Mata Pelajaran',
                'Hari',
                'Waktu Mulai',
                'Waktu Selesai',
                'Status',
                'Dibuat Pada'
            ]
        ], { origin: 'A1' });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'ClassSubjects');

        XLSX.writeFile(workbook, 'class_subjects.xlsx');
    };

    const exportToSql = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const columns = [
            'subject_teacher_id',
            'classroom_id',
            'day',
            'start_time',
            'end_time',
            'status',
            'created_at'
        ];

        const sqlStatements = exportData.map(data => {
            const values = [
                `'${data.subject_teacher_id}'`,
                data.classroom_id ? `'${data.classroom_id}'` : 'NULL',
                `'${data.day}'`,
                `'${data.start_time}'`,
                `'${data.end_time}'`,
                data.status ? '1' : '0',
                `'${data.created_at}'`
            ];

            return `INSERT INTO class_subjects (${columns.join(', ')}) VALUES (${values.join(', ')});`;
        }).join('\n');

        downloadFile(sqlStatements, 'class_subjects.sql', 'text/plain');
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
