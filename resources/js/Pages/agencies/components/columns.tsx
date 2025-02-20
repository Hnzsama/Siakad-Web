import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format, isWithinInterval } from 'date-fns';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Agency } from '../data/schema';
import { DateRange } from 'react-day-picker';
import { ExtendedColumnMeta } from '@/types/app/extendedColumnMeta';

export const columns: ColumnDef<Agency>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        enableGlobalFilter: false,
    },
    {
        accessorKey: 'agencyable.name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama" />
        ),
        cell: ({ getValue }) => <span className='truncate'>{getValue() as string}</span>,
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
            label: 'Nama',
        } as ExtendedColumnMeta<Agency>,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Agensi" />
        ),
        cell: ({ row }) => (
            <div className="text-nowrap">{row.getValue('name')}</div>
        ),
        enableColumnFilter: true,
        meta: {
            label: 'Agensi',
        } as ExtendedColumnMeta<Agency>,
    },
    {
        accessorKey: 'address',
        header: 'Address',
        cell: ({ row }) => <div className='truncate'>{row.getValue('address')}</div>,
        meta: {
            label: 'Alamat',
        } as ExtendedColumnMeta<Agency>,
    },
    {
        accessorKey: 'longitude',
        header: 'Longitude',
        cell: ({ row }) => <div>{row.getValue('longitude')}</div>,
        meta: {
            label: 'Longitude',
        } as ExtendedColumnMeta<Agency>,
    },
    {
        accessorKey: 'latitude',
        header: 'Latitude',
        cell: ({ row }) => <div>{row.getValue('latitude')}</div>,
        meta: {
            label: 'Latitude',
        } as ExtendedColumnMeta<Agency>,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.getValue('status') as boolean;
            return (
                <Badge variant={status ? 'default' : 'secondary'}>
                    {status ? 'Aktif' : 'Nonaktif'}
                </Badge>
            );
        },
        enableColumnFilter: true,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        meta: {
            label: 'Status',
        } as ExtendedColumnMeta<Agency>,
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
        accessorKey: 'agencyable_type',
        header: 'agencyable_type',
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
