import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format, isWithinInterval } from 'date-fns';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Subject } from '../data/schema';
import { DateRange } from 'react-day-picker';
import { ExtendedColumnMeta } from '@/types/app/extendedColumnMeta';

export const columns: ColumnDef<Subject>[] = [
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
            <DataTableColumnHeader column={column} title='Nama Mata Pelajaran' />
        ),
        cell: ({ row }) => (
            <div className='font-medium truncate'>{row.getValue('name')}</div>
        ),
        meta: {
            label: 'Nama Mata Pelajaran',
        } as ExtendedColumnMeta<Subject>,
    },
    {
        accessorKey: 'type',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Jenis' />
        ),
        cell: ({ row }) => {
            const type = row.getValue('type') as 'theorical' | 'practical';
            return (
                <Badge variant={type === 'theorical' ? 'default' : 'outline'}>
                    {type === 'theorical' ? 'Teori' : 'Praktik'}
                </Badge>
            );
        },
        meta: {
            label: 'Jenis',
        } as ExtendedColumnMeta<Subject>,
    },
    {
        accessorKey: 'code',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Kode' />
        ),
        cell: ({ row }) => (
            <div>{row.getValue('code') || '-'}</div>
        ),
        meta: {
            label: 'Kode',
        } as ExtendedColumnMeta<Subject>,
    },
    {
        accessorKey: 'description',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Deskripsi' />
        ),
        cell: ({ row }) => (
            <div className='truncate'>{row.getValue('description') || '-'}</div>
        ),
        meta: {
            label: 'Deskripsi',
        } as ExtendedColumnMeta<Subject>,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ row }) => {
            const status = row.getValue('status') as boolean;
            return (
                <Badge variant={status ? 'default' : 'outline'} className='text-nowrap'>
                    {status ? 'Aktif' : 'Nonaktif'}
                </Badge >
            );
        },
        meta: {
            label: 'Status',
        } as ExtendedColumnMeta<Subject>,
    },
    {
        accessorKey: 'created_at',
        header: 'Tanggal Dibuat',
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
