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
import { Classroom, Exportable } from "../data/schema";

interface ExportDropdownProps {
    data: Classroom[];
}

export function ExportDropdown({ data }: ExportDropdownProps) {
    const prepareDataForExport = (datas: ExportDropdownProps['data']): Exportable[] => {
        return datas.map(data => ({
            name: data.name,
            teacher_id: data.teacher_id,
            class_level_id: data.class_level_id,
            study_group_id: data.study_group_id,
            shift_id: data.shift_id,
            major_id: data.major_id,
            room_number: data.room_number,
            status: data.status,
            homeroom_teacher: data.homeroom_teacher,
            class_level: data.class_level,
            study_group: data.study_group,
            shift: data.shift,
            major: data.major
        }));
    };

    const headers = [
        'Nama Kelas',
        'Wali Kelas',
        'Tingkat Kelas',
        'Kelompok Belajar',
        'Shift',
        'Jurusan',
        'Ruangan',
        'Status'
    ];

    const columns = [
        'teacher_id',
        'class_level_id',
        'study_group_id',
        'shift_id',
        'major_id',
        'room_number',
        'status'
    ];

    const exportToCsv = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const csvRows = exportData.map(data => [
            data.name,
            data.homeroom_teacher?.name ?? '',
            data.class_level?.alphabet ?? '',
            data.study_group?.name ?? '',
            data.shift?.name ?? '',
            data.major?.name ?? '',
            data.room_number,
            data.status
        ].map(value =>
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(','));

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        downloadFile(csvContent, 'classrooms.csv', 'text/csv');
    };

    const exportToExcel = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(exportData.map(data => ({
            'Nama Kelas': data.name,
            'Wali Kelas': data.homeroom_teacher?.name ?? '',
            'Tingkat Kelas': data.class_level?.alphabet ?? '',
            'Kelompok Belajar': data.study_group?.name ?? '',
            'Shift': data.shift?.name ?? '',
            'Jurusan': data.major?.name ?? '',
            'Ruangan': data.room_number,
            'Status': data.status
        })));

        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Classrooms');

        XLSX.writeFile(workbook, 'classrooms.xlsx');
    };

    const exportToSql = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const sqlStatements = exportData.map(item => {
            const values = [
                item.teacher_id,
                item.class_level_id,
                item.study_group_id,
                item.shift_id,
                item.major_id,
                item.room_number,
                item.status
            ].map(value => value === null ? 'NULL' : `'${String(value).replace(/'/g, "''")}'`);

            return `INSERT INTO classrooms (${columns.join(', ')}) VALUES (${values.join(', ')});`;
        }).join('\n');

        downloadFile(sqlStatements, 'classrooms.sql', 'text/plain');
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
                <Button variant='outline' className='space-x-1'>
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
