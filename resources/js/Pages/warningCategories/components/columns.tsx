import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { format, isWithinInterval } from 'date-fns';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { WarningCategory } from '../data/schema';
import { DateRange } from 'react-day-picker';
import { ExtendedColumnMeta } from '@/types/app/extendedColumnMeta';

export const columns: ColumnDef<WarningCategory>[] = [
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
        accessorKey: 'category_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Nama Peringatan' />
        ),
        cell: ({ row }) => (
            <div className='font-medium truncate'>{row.getValue('category_name')}</div>
        ),
        meta: {
            label: 'Nama Peringatan',
        } as ExtendedColumnMeta<WarningCategory>,
    },
    {
        accessorKey: 'level',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Level' />
        ),
        cell: ({ row }) => (
            <div>SP{row.getValue('level')}</div>
        ),
        meta: {
            label: 'Level',
        } as ExtendedColumnMeta<WarningCategory>,
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
        } as ExtendedColumnMeta<WarningCategory>,
    },
    {
        accessorKey: 'warnings_counts',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Jumlah Peringatan' />
        ),
        cell: ({ row }) => (
            <div className='text-center'>{row.getValue('warnings_counts') || 0}</div>
        ),
        enableSorting: true,
        enableHiding: false,
        meta: {
            label: 'Jumlah Peringatan',
        } as ExtendedColumnMeta<WarningCategory>,
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
        enableHiding: true,
    },
];
