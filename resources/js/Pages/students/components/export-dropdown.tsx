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
import { Student, Exportable } from "../data/schema";
import { useResourceContext } from "../context/context";

interface ExportDropdownProps {
    data: Student[];
}

export function ExportDropdown({ data }: ExportDropdownProps) {
    const { permissions } = useResourceContext()

    const prepareDataForExport = (datas: ExportDropdownProps['data']): Exportable[] => {
        return datas.map(data => ({
            user_id: data.user_id,
            semester_id: data.semester_id,
            guardian_id: data.guardian_id,
            classroom_id: data.classroom_id,
            name: data.name,
            nik: data.nik,
            nis: data.nis,
            gender: data.gender,
            place_of_birth: data.place_of_birth,
            date_of_birth: data.date_of_birth,
            address: data.address,
            phone: data.phone,
            email: data.email,
            status: data.status,
            enrollment_date: data.enrollment_date,
            graduation_date: data.graduation_date,
            violation_points: data.violation_points,
            user: data.user,
            guardian: data.guardian,
            semester: data.semester,
            classroom: data.classroom
        }));
    };

    const headers = [
        'Nama',
        'NIK',
        'NIS',
        'Jenis Kelamin',
        'Tempat Lahir',
        'Tanggal Lahir',
        'Alamat',
        'Telepon',
        'Email',
        'Status',
        'Tanggal Masuk',
        'Tanggal Lulus',
        'Poin Pelanggaran',
        'Kelas',
        'Semester',
        'Wali',
        'Pengguna'
    ];

    const columns = [
        'name',
        'nik',
        'nis',
        'gender',
        'place_of_birth',
        'date_of_birth',
        'address',
        'phone',
        'email',
        'status',
        'enrollment_date',
        'graduation_date',
        'violation_points',
        'classroom_id',
        'semester_id',
        'guardian_id',
        'user_id'
    ];

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID');
    };

    const translateGender = (gender: 'Male' | 'Female') => {
        return gender === 'Male' ? 'Laki-laki' : 'Perempuan';
    };

    const translateStatus = (status: 'Active' | 'Graduated' | 'Dropped Out') => {
        const statusMap = {
            'Active': 'Aktif',
            'Graduated': 'Lulus',
            'Dropped Out': 'Keluar'
        };
        return statusMap[status];
    };

    const exportToCsv = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const csvRows = exportData.map(data => [
            data.name,
            data.nik,
            data.nis,
            translateGender(data.gender),
            data.place_of_birth,
            formatDate(data.date_of_birth),
            data.address,
            data.phone ?? '',
            data.email,
            translateStatus(data.status),
            formatDate(data.enrollment_date),
            data.graduation_date ? formatDate(data.graduation_date) : '',
            data.violation_points,
            data.classroom?.name,
            data.semester.name,
            data.guardian?.name,
            data.user.name
        ].map(value =>
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(','));

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        downloadFile(csvContent, 'students.csv', 'text/csv');
    };

    const exportToExcel = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(exportData.map(data => ({
            'Nama': data.name,
            'NIK': data.nik,
            'NIS': data.nis,
            'Jenis Kelamin': translateGender(data.gender),
            'Tempat Lahir': data.place_of_birth,
            'Tanggal Lahir': formatDate(data.date_of_birth),
            'Alamat': data.address,
            'Telepon': data.phone ?? '',
            'Email': data.email,
            'Status': translateStatus(data.status),
            'Tanggal Masuk': formatDate(data.enrollment_date),
            'Tanggal Lulus': data.graduation_date ? formatDate(data.graduation_date) : '',
            'Poin Pelanggaran': data.violation_points,
            'Kelas': data.classroom?.name,
            'Semester': data.semester.name,
            'Wali': data.guardian?.name,
            'Pengguna': data.user.name
        })));

        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

        XLSX.writeFile(workbook, 'students.xlsx');
    };

    const exportToSql = () => {
        const exportData = prepareDataForExport(data);
        if (exportData.length === 0) return;

        const sqlStatements = data.map(item => {
            const values = [
                item.user_id,
                item.semester_id,
                item.guardian_id,
                item.classroom_id,
                item.name,
                item.nik,
                item.nis,
                item.gender,
                item.place_of_birth,
                item.date_of_birth,
                item.address,
                item.phone,
                item.email,
                item.status,
                item.enrollment_date,
                item.graduation_date,
                item.violation_points
            ].map(value => {
                if (value === null) return 'NULL';
                if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
                return `'${String(value).replace(/'/g, "''")}'`;
            });

            return `INSERT INTO students (${columns.join(', ')}) VALUES (${values.join(', ')});`;
        }).join('\n');

        downloadFile(sqlStatements, 'students.sql', 'text/plain');
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
