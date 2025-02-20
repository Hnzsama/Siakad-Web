import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format, isWithinInterval } from 'date-fns';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Guardian } from '../data/schema';
import { DateRange } from 'react-day-picker';
import { Data } from '../data/data';
import { ExtendedColumnMeta } from '@/types/app/extendedColumnMeta';

export const columns: ColumnDef<Guardian>[] = [
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
            <DataTableColumnHeader column={column} title='Nama' />
        ),
        cell: ({ row }) => (
            <div className='truncate'>{row.getValue('name')}</div>
        ),
        enableColumnFilter: true,
        meta: {
            label: 'Nama',
        } as ExtendedColumnMeta<Guardian>,
    },
    {
        accessorKey: 'relationship',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Hubungan' />
        ),
        cell: ({ row }) => (
            <Badge variant='default'>{row.getValue('relationship')}</Badge>
        ),
        enableColumnFilter: true,
        meta: {
            label: 'Hubungan',
        } as ExtendedColumnMeta<Guardian>,
    },
    {
        accessorKey: 'gender',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Gender' />
        ),
        cell: ({ row }) => {
            const gender = row.getValue('gender')
            const genderInfo = Data().genderFilter.find(genderOption => genderOption.value === gender);
            return (
                <Badge variant={genderInfo?.value === 'Male' ? 'default' : 'secondary'}>
                    {genderInfo?.label}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableColumnFilter: true,
        meta: {
            label: 'Gender',
        } as ExtendedColumnMeta<Guardian>,
    },
    {
        accessorKey: 'nik',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='NIK' />
        ),
        cell: ({ row }) => (
            <div className='truncate'>{row.getValue('nik')}</div>
        ),
        enableColumnFilter: true,
        meta: {
            label: 'NIK',
        } as ExtendedColumnMeta<Guardian>,
    },
    {
        accessorKey: 'email',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Email' />
        ),
        cell: ({ row }) => (
            <div className='truncate'>{row.getValue('email')}</div>
        ),
        enableColumnFilter: true,
        meta: {
            label: 'Email',
        } as ExtendedColumnMeta<Guardian>,
    },
    {
        accessorKey: 'phone',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='No. Telepon' />
        ),
        cell: ({ row }) => (
            <div className='truncate'>{row.getValue('phone')}</div>
        ),
        enableColumnFilter: true,
        meta: {
            label: 'No. Telepon',
        } as ExtendedColumnMeta<Guardian>,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ row }) => {
            const status = row.getValue('status');
            return (
                <Badge variant={status ? 'default' : 'secondary'}>
                    {status ? 'Aktif' : 'Nonaktif'}
                </Badge>
            );
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
        enableColumnFilter: true,
        meta: {
            label: 'Status',
        } as ExtendedColumnMeta<Guardian>,
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Dibuat Pada' />
        ),
        cell: ({ row }) => format(new Date(row.getValue('created_at')), 'dd MMM yyyy'),
        filterFn: (row, id, filterValue: DateRange | undefined) => {
            if (!filterValue?.from) return true;

            const rowDate = new Date(row.getValue(id));
            const from = new Date(filterValue.from);
            const to = filterValue.to ? new Date(filterValue.to) : from;

            return isWithinInterval(rowDate, { start: from, end: to });
        },
        enableSorting: false,
        enableGlobalFilter: false,
        enableHiding: false,
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
        enableHiding: true
    },
];
