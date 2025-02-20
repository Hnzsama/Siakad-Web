import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format, isWithinInterval } from 'date-fns';
import { id } from 'date-fns/locale';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { LeaveRequest } from '../data/schema';
import { DateRange } from 'react-day-picker';
import { Data } from '../data/data';
import { ExtendedColumnMeta } from '@/types/app/extendedColumnMeta';

export const columns: ColumnDef<LeaveRequest>[] = [
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
        accessorKey: "leavable.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama" />
        ),
        cell: ({ row }) => {
            const leavable = row.original.leavable;
            if (!leavable) return <div>-</div>;
            const identifier = leavable && 'nis' in leavable ? leavable.nis : leavable.nip;
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{leavable.name}</span>
                    <span className="text-xs text-muted-foreground">{identifier}</span>
                </div>
            );
        },
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: (row, _columnId, value) => {
            const leavable = row.getValue('leavable') as { name: string; nis?: string; nip?: string };
            return leavable?.name?.toLowerCase().includes(value.toLowerCase()) ||
                   leavable?.nis?.toLowerCase().includes(value.toLowerCase()) ||
                   leavable?.nip?.toLowerCase().includes(value.toLowerCase()) || false;
        },
        meta: {
            label: 'Nama',
        } as ExtendedColumnMeta<LeaveRequest>,
    },
    {
        accessorKey: 'leavable_type',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tipe Pemohon" />
        ),
        cell: ({ row }) => {
            const type = row.getValue('leavable_type') as string;
            return <span>{type.includes('Student') ? 'Siswa' : 'Guru'}</span>;
        },
        enableColumnFilter: true,
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
        meta: {
            label: 'Tipe Pemohon',
        } as ExtendedColumnMeta<LeaveRequest>,
    },
    {
        accessorKey: 'leave_type.leave_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tipe Cuti" />
        ),
        cell: ({ getValue }) => <span className='truncate'>{getValue() as string}</span>,
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
            label: 'Tipe Cuti',
        } as ExtendedColumnMeta<LeaveRequest>,
    },
    {
        accessorKey: 'semester.name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Semester" />
        ),
        cell: ({ getValue }) => <span className='truncate'>{getValue() as string}</span>,
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
            label: 'Semester',
        } as ExtendedColumnMeta<LeaveRequest>,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.getValue('status') as string;

            const getVariant = (status: string) => {
                switch (status) {
                    case 'Approved':
                        return 'default';
                    case 'Rejected':
                        return 'destructive';
                    default:
                        return 'secondary';
                }
            };

            return (
                <Badge variant={getVariant(status)} className='truncate'>
                    {status === 'Approved' ? 'Disetujui' :
                     status === 'Rejected' ? 'Ditolak' : 'Menunggu'}
                </Badge>
            );
        },
        enableColumnFilter: true,
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
        meta: {
            label: 'Status',
        } as ExtendedColumnMeta<LeaveRequest>,
    },
    {
        accessorKey: 'start_date',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tanggal Mulai" />
        ),
        cell: ({ row }) => {
            const date = row.getValue('start_date') as string;
            return <span className='truncate'>{format(new Date(date), 'dd MMMM yyyy', { locale: id })}</span>
        },
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
            label: 'Tanggal Mulai',
        } as ExtendedColumnMeta<LeaveRequest>,
    },
    {
        accessorKey: 'end_date',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tanggal Selesai" />
        ),
        cell: ({ row }) => {
            const date = row.getValue('end_date') as string;
            return <span className='truncate'>{format(new Date(date), 'dd MMMM yyyy', { locale: id })}</span>
        },
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
            label: 'Tanggal Selesai',
        } as ExtendedColumnMeta<LeaveRequest>,
    },
    {
        accessorKey: 'approver',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Disetujui Oleh" />
        ),
        cell: ({ row }) => {
            const approver = row.original.approver;
            return approver ? <span>{approver.name}</span> : '-';
        },
        enableColumnFilter: true,
        meta: {
            label: 'Disetujui Oleh',
        } as ExtendedColumnMeta<LeaveRequest>,
    },
    {
        accessorKey: 'rejected_at',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Ditolak Pada" />
        ),
        cell: ({ row }) => {
            const date = row.getValue('rejected_at') as string;
            return date ? <span>{format(new Date(date), 'dd MMMM yyyy', { locale: id })}</span> : '-';
        },
        enableColumnFilter: true,
        meta: {
            label: 'Ditolak Pada',
        } as ExtendedColumnMeta<LeaveRequest>,
    },
    {
        accessorKey: 'rejection_reason',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Alasan Penolakan" />
        ),
        cell: ({ row }) => {
            const reason = row.getValue('rejection_reason') as string;
            return reason || '-';
        },
        enableColumnFilter: true,
        meta: {
            label: 'Alasan Penolakan',
        } as ExtendedColumnMeta<LeaveRequest>,
    },
    {
        accessorKey: 'repellent',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Ditolak Oleh" />
        ),
        cell: ({ row }) => {
            const repellent = row.original.repellent;
            return repellent ? <span>{repellent.name}</span> : '-';
        },
        enableColumnFilter: true,
        meta: {
            label: 'Ditolak Oleh',
        } as ExtendedColumnMeta<LeaveRequest>,
    },
    {
        accessorKey: 'reason',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Alasan" />
        ),
        cell: ({ row }) => <div className="truncate max-w-[500px]">{row.getValue('reason')}</div>,
        enableColumnFilter: true,
        meta: {
            label: 'Alasan',
        } as ExtendedColumnMeta<LeaveRequest>,
    },
    {
        accessorKey: 'attachment_url',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Lampiran" />
        ),
        cell: ({ row }) => {
            const url = row.getValue('attachment_url') as string;
            return url ? (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                >
                    Lihat Lampiran
                </a>
            ) : '-';
        },
        meta: {
            label: 'Lampiran',
        } as ExtendedColumnMeta<LeaveRequest>,
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Dibuat Pada" />
        ),
        cell: ({ row }) => {
            const date = row.getValue('created_at') as string;
            return <span className='truncate'>{format(new Date(date), 'dd MMMM yyyy', { locale: id })}</span>;
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
        enableGlobalFilter: false,
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
        enableHiding: true,
    },
];
