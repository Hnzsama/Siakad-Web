import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format, isWithinInterval } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Semester } from '../data/schema';
import { cn } from '@/lib/utils';
import { ExtendedColumnMeta } from '@/types/app/extendedColumnMeta';

export const columns: ColumnDef<Semester>[] = [
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
            <DataTableColumnHeader column={column} title='Nama Semester' />
        ),
        cell: ({ row }) => (
            <div className='font-medium truncate'>{row.getValue('name')}</div>
        ),
        enableColumnFilter: true,
        meta: {
            label: 'Nama Semester',
            className: cn('')
        } as ExtendedColumnMeta<Semester>,
    },
    {
        accessorKey: 'type',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Tipe' />
        ),
        cell: ({ row }) => {
            const type = row.getValue('type')
            return (
                <Badge variant={type === 'odd' ? 'default' : 'outline'}>{row.getValue('type') === 'odd' ? 'Ganjil' : 'Genap'}</Badge>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableColumnFilter: true,
        meta: {
            label: 'Tipe',
        } as ExtendedColumnMeta<Semester>,
    },
    {
        accessorKey: 'academic_year',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Tahun Akademik' />
        ),
        cell: ({ row }) => (
            <div className='truncate'>{row.getValue('academic_year')}</div>
        ),
        enableColumnFilter: true,
        meta: {
            label: 'Tahun Akademik',
        } as ExtendedColumnMeta<Semester>,
    },
    {
        accessorKey: 'start_date',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Tanggal Mulai' />
        ),
        cell: ({ row }) => format(new Date(row.getValue('start_date')), 'dd MMM yyyy'),
        enableColumnFilter: true,
        meta: {
            label: 'Tanggal Mulai',
        } as ExtendedColumnMeta<Semester>,
    },
    {
        accessorKey: 'end_date',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Tanggal Selesai' />
        ),
        cell: ({ row }) => format(new Date(row.getValue('end_date')), 'dd MMM yyyy'),
        enableColumnFilter: true,
        meta: {
            label: 'Tanggal Selesai',
        } as ExtendedColumnMeta<Semester>,
    },
    {
        accessorKey: 'description',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Deskripsi' />
        ),
        cell: ({ row }) => (
            <div className='truncate'>{row.getValue('description') || '-'}</div>
        ),
        enableColumnFilter: true,
        meta: {
            label: 'Deskripsi',
        } as ExtendedColumnMeta<Semester>,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ row }) => {
            const status = row.getValue('status')
            return (
                <div className='flex justify-center'>
                    <Badge variant={status === "active" ? "default" : status === "completed" ? "secondary" : "outline"}>
                        {status === "active" ? "Aktif" : status === "completed" ? "Selesai" : "Menunggu"}
                    </Badge>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableColumnFilter: true,
        meta: {
            label: 'Status',
        } as ExtendedColumnMeta<Semester>,
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
