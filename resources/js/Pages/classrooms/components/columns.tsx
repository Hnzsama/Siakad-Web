import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format, isWithinInterval } from 'date-fns';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Classroom } from '../data/schema';
import { DateRange } from 'react-day-picker';
import { ExtendedColumnMeta } from '@/types/app/extendedColumnMeta';
import { cn } from '@/lib/utils';
import { can } from '@/utils/permissions';

export const columns: ColumnDef<Classroom>[] = [
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
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Nama Kelas'/>
        ),
        cell: ({ row }) => (
            <div className='font-medium'>{row.getValue('name')}</div>
        ),
        meta: {
            label: 'Nama Kelas',
        } as ExtendedColumnMeta<Classroom>,
    },
    {
        accessorKey: 'room_number',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Ruangan' />
        ),
        cell: ({ row }) => (
            <div>{row.getValue('room_number') || '-'}</div>
        ),
        meta: {
            label: 'Ruangan',
        } as ExtendedColumnMeta<Classroom>,
    },
    {
        accessorKey: 'homeroom_teacher.name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Wali Kelas' />
        ),
        cell: ({ getValue }) => <span className='truncate'>{getValue() as string}</span>,
        meta: {
            label: 'Wali Kelas',
        } as ExtendedColumnMeta<Classroom>,
    },
    {
      accessorKey: 'shift.name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Shift' />
        ),
        cell: ({ getValue }) => <span className='truncate'>{getValue() as string}</span>,
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
            label: 'Shift',
        } as ExtendedColumnMeta<Classroom>,
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
        accessorKey: 'major_id',
        header: 'Id Juruasan',
        cell: ({ row }) => (
            <div>{row.original.major?.id || '-'}</div>
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
        accessorKey: 'class_level_id',
        header: 'Id Tingkat Kelas',
        cell: ({ row }) => (
            <div>{row.original.class_level?.id || '-'}</div>
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
        accessorKey: 'study_group_id',
        header: 'Id Kelompok Belajar',
        cell: ({ row }) => (
            <div>{row.original.study_group?.id || '-'}</div>
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
        accessorKey: 'shift_id',
        header: 'Id Shift',
        cell: ({ row }) => (
            <div>{row.original.shift?.id || '-'}</div>
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
