import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format, isWithinInterval } from 'date-fns';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Schedule } from '../data/schema';
import { DateRange } from 'react-day-picker';
import { ExtendedColumnMeta } from '@/types/app/extendedColumnMeta';

export const columns: ColumnDef<Schedule>[] = [
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
        accessorKey: 'day',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Hari' />
        ),
        cell: ({ row }) => (
            <div className='truncate'>{row.getValue('day')}</div>
        ),
        enableColumnFilter: true,
        meta: {
            label: 'Hari',
        } as ExtendedColumnMeta<Schedule>,
    },
    {
        accessorKey: 'start_time',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Waktu Mulai' />
        ),
        cell: ({ row }) => (
            <div>{format(new Date(`2000-01-01T${row.getValue('start_time')}`), 'HH:mm')}</div>
        ),
        enableColumnFilter: true,
        meta: {
            label: 'Waktu Mulai',
        } as ExtendedColumnMeta<Schedule>,
    },
    {
        accessorKey: 'end_time',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Waktu Selesai' />
        ),
        cell: ({ row }) => (
            <div>{format(new Date(`2000-01-01T${row.getValue('end_time')}`), 'HH:mm')}</div>
        ),
        enableColumnFilter: true,
        meta: {
            label: 'Waktu Selesai',
        } as ExtendedColumnMeta<Schedule>,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ row }) => {
            const status = row.getValue('status') as boolean;
            return (
                <Badge variant={status ? 'default' : 'secondary'}>
                    {status ? 'Aktif' : 'Nonaktif'}
                </Badge>
            );
        },
        filterFn: (row, id, value: string[]) => value.includes(row.getValue(id) as string),
        enableColumnFilter: true,
        meta: {
            label: 'Status',
        } as ExtendedColumnMeta<Schedule>,
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
        accessorKey: 'shift_id',
        header: 'Shift',
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
