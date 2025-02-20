import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format, isWithinInterval } from 'date-fns';
import { id } from 'date-fns/locale';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Attendance } from '../data/schema';
import { DateRange } from 'react-day-picker';
import { Data } from '../data/data';
import { ExtendedColumnMeta } from '@/types/app/extendedColumnMeta';

export const columns: ColumnDef<Attendance>[] = [
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
        accessorKey: "attendable.name",  // or use an accessor function if you need more control
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama" />
        ),
        cell: ({ getValue }) => <span className='truncate'>{getValue() as string}</span>,
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: (row, columnId, value) => {
            const attendable = row.getValue('attendable') as { name: string };
            // Ensure that we are filtering based on the `name` property of the `attendable` object
            return attendable?.name?.toLowerCase().includes(value.toLowerCase()) ?? false;
        },
        meta: {
            label: 'Nama',
        } as ExtendedColumnMeta<Attendance>,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const { statusFilter } = Data();
            const status = row.getValue('status') as string;

            const statusLabel = statusFilter.find((item) => item.value === status)?.label || status;

            return (
                <Badge variant={status === 'Present' ? 'default' : 'secondary'} className='truncate'>
                    {statusLabel}
                </Badge>
            );
        },
        enableColumnFilter: true,
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
        meta: {
            label: 'Status',
        } as ExtendedColumnMeta<Attendance>,
    },
    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => {
            const date = row.getValue('date') as string;
            return <span className='truncate'>{format(new Date(date), 'dd MMMM yyyy', { locale: id })}</span>
        },
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
            label: 'Tanggal',
        } as ExtendedColumnMeta<Attendance>,
    },
    {
        accessorKey: 'check_in',
        header: 'Masuk',
        cell: ({ row }) => {
            const checkIn = row.getValue('check_in') as string | null;
            return checkIn ? (
                <span className='truncate'>{format(new Date(`1970-01-01T${checkIn}Z`), 'hh:mm a')}</span>
            ) : (
                '-'
            );
        },
        meta: {
            label: 'Masuk',
        } as ExtendedColumnMeta<Attendance>,
    },
    {
        accessorKey: 'check_out',
        header: 'Pulang',
        cell: ({ row }) => {
            const checkOut = row.getValue('check_out') as string | null;
            return checkOut ? (
                <span className='truncate'>{format(new Date(`1970-01-01T${checkOut}Z`), 'hh:mm a')}</span>
            ) : (
                '-'
            );
        },
        meta: {
            label: 'Pulang',
        } as ExtendedColumnMeta<Attendance>,
    },
    {
        accessorKey: 'location_latitude',
        header: 'Latitude',
        cell: ({ row }) => <div>{row.getValue('location_latitude') ?? '-'}</div>,
        meta: {
            label: 'Latitude',
        } as ExtendedColumnMeta<Attendance>,
    },
    {
        accessorKey: 'location_longitude',
        header: 'Longitude',
        cell: ({ row }) => <div>{row.getValue('location_longitude') ?? '-'}</div>,
        meta: {
            label: 'Longitude',
        } as ExtendedColumnMeta<Attendance>,
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
        accessorKey: 'attendable_type',
        header: 'Attendable Type',
        cell: ({ row }) => <div>{row.getValue('attendable_type')}</div>,
        enableColumnFilter: false,
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
