import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format, isWithinInterval } from 'date-fns';
import { id } from 'date-fns/locale';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { WarningLetter } from '../data/schema';
import { DateRange } from 'react-day-picker';
import { ExtendedColumnMeta } from '@/types/app/extendedColumnMeta';

export const columns: ColumnDef<WarningLetter>[] = [
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
        accessorKey: 'letter_number',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nomor Surat" />
        ),
        cell: ({ row }) => <div className="truncate">{row.getValue('letter_number')}</div>,
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
            label: 'Nomor Surat',
        } as ExtendedColumnMeta<WarningLetter>,
    },
    {
        accessorKey: "student.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama Siswa" />
        ),
        cell: ({ getValue }) => <span className='truncate'>{getValue() as string}</span>,
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: (row, columnId, value) => {
            const student = row.getValue('student') as { name: string };
            return student?.name?.toLowerCase().includes(value.toLowerCase()) ?? false;
        },
        meta: {
            label: 'Nama Siswa',
        } as ExtendedColumnMeta<WarningLetter>,
    },
    {
        accessorKey: 'warning_category.category_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Kategori Peringatan" />
        ),
        cell: ({ getValue }) => <span className='truncate'>{getValue() as string}</span>,
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
            label: 'Kategori Peringatan',
        } as ExtendedColumnMeta<WarningLetter>,
    },
    {
        accessorKey: 'issued_date',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tanggal Surat" />
        ),
        cell: ({ row }) => {
            const date = row.getValue('issued_date') as string;
            return <span className='truncate'>{format(new Date(date), 'dd MMMM yyyy', { locale: id })}</span>;
        },
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
            label: 'Tanggal Surat',
        } as ExtendedColumnMeta<WarningLetter>,
    },
    {
        accessorKey: 'parent_received_at',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tanggal Diterima" />
        ),
        cell: ({ row }) => {
            const date = row.getValue('parent_received_at') as string | null;
            return date ? (
                <Badge variant="default" className='truncate'>
                    {format(new Date(date), 'dd MMM yyyy')}
                </Badge>
            ) : (
                <Badge variant="secondary" className='truncate'>Pending</Badge>
            );
        },
        meta: {
            label: 'Tanggal Diterima',
        } as ExtendedColumnMeta<WarningLetter>,
    },
    {
        accessorKey: 'follow_up_date',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tanggal tindak lanjut" />
        ),
        cell: ({ row }) => {
            const date = row.getValue('follow_up_date') as string | null;
            return date ? (
                <span className='truncate'>{format(new Date(date), 'dd MMMM yyyy')}</span>
            ) : (
                '-'
            );
        },
        meta: {
            label: 'Tanggal tindak lanjut',
        } as ExtendedColumnMeta<WarningLetter>,
    },
    {
        accessorKey: 'cancelled_at',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tanggal Pembatalan" />
        ),
        cell: ({ row }) => {
            const date = row.getValue('cancelled_at') as string | null;
            return date ? (
                <span className='truncate'>{format(new Date(date), 'dd MMMM yyyy', { locale: id })}</span>
            ) : (
                '-'
            );
        },
        enableColumnFilter: true,
        meta: {
            label: 'Tanggal Pembatalan',
        } as ExtendedColumnMeta<WarningLetter>,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return (
                <Badge
                    variant={
                        status === 'cancelled'
                            ? 'destructive'
                            : status === 'approved'
                                ? 'default'
                                : 'secondary'
                    }
                    className='truncate'
                >
                    {status === 'cancelled'
                        ? 'Dibatalkan'
                        : status === 'approved'
                            ? 'Disetujui'
                            : 'Tertunda'
                    }
                </Badge>
            );
        },
        enableColumnFilter: true,
        filterFn: (row, id, value) => {
            const status = row.getValue('status') as string;
            return value.includes(status);
        },
        meta: {
            label: 'Status',
        } as ExtendedColumnMeta<WarningLetter>,
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" />
        ),
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
        enableSorting: true,
        enableHiding: false,
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
        enableHiding: false,
    },
];
