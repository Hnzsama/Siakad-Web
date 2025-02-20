import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { StudentHistory } from '../data/schema';
import { DateRange } from 'react-day-picker';
import { format, isWithinInterval } from 'date-fns';
import { ExtendedColumnMeta } from '@/types/app/extendedColumnMeta';

export const columns: ColumnDef<StudentHistory>[] = [
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
        accessorKey: 'student.nis',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='NIS' />
        ),
        cell: ({ row }) => (
            <div className='font-medium'>{row.original.student?.nis || '-'}</div>
        ),
        meta: {
            label: 'NIS',
        } as ExtendedColumnMeta<StudentHistory>,
    },
    {
        accessorKey: 'student.name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Nama Siswa' />
        ),
        cell: ({ row }) => (
            <div className='font-medium'>{row.original.student?.name || '-'}</div>
        ),
        meta: {
            label: 'Nama Siswa',
        } as ExtendedColumnMeta<StudentHistory>,
    },
    {
        accessorKey: 'semester_id',
        header: 'Id Kelas',
        cell: ({ row }) => (
            <div>{row.original.semester?.id || '-'}</div>
        ),
        enableColumnFilter: false,
        enableSorting: false,
        enableHiding: false,
        enableGlobalFilter: false,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        meta: {
            label: 'Semester',
        } as ExtendedColumnMeta<StudentHistory>,
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
        accessorKey: 'semester.name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Semester' />
        ),
        cell: ({ row }) => (
            <div>{`${row.original.semester?.name} ${row.original.semester?.academic_year}` || '-'}</div>
        ),
        meta: {
            label: 'Semester',
        } as ExtendedColumnMeta<StudentHistory>,
    },
    {
        accessorKey: 'classroom.name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Kelas' />
        ),
        cell: ({ row }) => (
            <div>{row.original.classroom?.name || '-'}</div>
        ),
        meta: {
            label: 'Kelas',
        } as ExtendedColumnMeta<StudentHistory>,
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
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
        enableHiding: true
    },
];
