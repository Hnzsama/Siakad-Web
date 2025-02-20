import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format, isWithinInterval } from 'date-fns';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Student } from '../data/schema';
import { DateRange } from 'react-day-picker';
import { Data } from '../data/data';
import { ExtendedColumnMeta } from '@/types/app/extendedColumnMeta';

export const columns: ColumnDef<Student>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
                className='translate-y-[2px]'
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label='Select row'
                className='translate-y-[2px]'
            />
        ),
        enableSorting: false,
        enableHiding: false,
        enableGlobalFilter: false,
    },
    {
        accessorKey: 'nis',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='NIS' />
        ),
        cell: ({ row }) => (
            <div className='font-medium'>{row.getValue('nis')}</div>
        ),
        meta: {
            label: 'NIS',
        } as ExtendedColumnMeta<Student>,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Nama Siswa' />
        ),
        cell: ({ row }) => (
            <div className='font-medium'>{row.getValue('name')}</div>
        ),
        meta: {
            label: 'Nama Siswa',
        } as ExtendedColumnMeta<Student>,
    },
    {
        accessorKey: 'gender',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Jenis Kelamin' />
        ),
        cell: ({ row }) => {
            const gender = row.getValue('gender') as 'Male' | 'Female';
            return (
                <Badge variant={gender === 'Male' ? 'default' : 'secondary'}>
                    {gender === 'Male' ? 'Laki-laki' : 'Perempuan'}
                </Badge>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        meta: {
            label: 'Jenis Kelamin',
        } as ExtendedColumnMeta<Student>,
    },
    {
        accessorKey: 'classroom_id',
        header: 'Id Kelas',
        cell: ({ row }) => (
            <div>{row.original.classroom?.id || '-'}</div>
        ),
        enableColumnFilter: false,
        enableSorting: false,
        enableHiding: false,
        enableGlobalFilter: false,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'classroom_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Kelas' />
        ),
        cell: ({ row }) => (
            <div>{row.original.classroom?.name || '-'}</div>
        ),
        meta: {
            label: 'Kelas',
        } as ExtendedColumnMeta<Student>,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ row }) => {
            const status = row.getValue('status') as 'Active' | 'Graduated' | 'Dropped Out';

            // Create mappings based on the statusFilter array
            const { statusFilter } = Data();

            const variantMap = {
                'Active': 'default',
                'Graduated': 'secondary',
                'Dropped Out': 'destructive'
            } as const;

            // Find the matching label from statusFilter
            const label = statusFilter.find(item => item.value === status)?.label ?? status;
            const variant = variantMap[status];

            return (
                <Badge variant={variant}>{label}</Badge>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        meta: {
            label: 'Status',
        } as ExtendedColumnMeta<Student>,
    },
    {
        accessorKey: 'violation_points',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Poin Pelanggaran' />
        ),
        cell: ({ row }) => (
            <div>{row.getValue('violation_points')}</div>
        ),
        meta: {
            label: 'Poin Pelanggaran',
        } as ExtendedColumnMeta<Student>,
    },
    {
        accessorKey: 'guardian.name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Orang Tua' />
        ),
        cell: ({ getValue }) => <span className='truncate'>{getValue() as string}</span>,
        meta: {
            label: 'Orang Tua',
        } as ExtendedColumnMeta<Student>,
    },
    {
        accessorKey: 'enrollment_date',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Tanggal Masuk' />
        ),
        cell: ({ row }) => {
            const date = row.getValue('enrollment_date') as string;
            return format(new Date(date), 'dd/MM/yyyy');
        },
        filterFn: (row, id, filterValue: DateRange | undefined) => {
            if (!filterValue?.from) return true;
            const rowDate = new Date(row.getValue(id) as string);
            const from = new Date(filterValue.from);
            const to = filterValue.to ? new Date(filterValue.to) : from;
            return isWithinInterval(rowDate, { start: from, end: to });
        },
        meta: {
            label: 'Tanggal Masuk',
        } as ExtendedColumnMeta<Student>,
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ row }) => {
            const date = row.getValue('created_at') as string;
            return format(new Date(date), 'LLL dd, y');
        },
        filterFn: (row, id, filterValue: DateRange | undefined) => {
            if (!filterValue?.from) return true;

            const rowDate = new Date(row.getValue(id) as string);
            const from = new Date(filterValue.from);
            const to = filterValue.to ? new Date(filterValue.to) : from;

            return isWithinInterval(rowDate, { start: from, end: to });
        },
        enableSorting: false,
        enableHiding: false,
        enableGlobalFilter: false,
    },
    {
        accessorKey: 'guardian_id',
        header: 'Id Orang Tua',
        cell: ({ row }) => (
            <div>{row.original.guardian?.id || '-'}</div>
        ),
        enableColumnFilter: false,
        enableSorting: false,
        enableHiding: false,
        enableGlobalFilter: false,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
        enableHiding: true
    },
];
