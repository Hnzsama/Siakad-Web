import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format, isWithinInterval } from 'date-fns';
import { id } from 'date-fns/locale';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Violation } from '../data/schema';
import { DateRange } from 'react-day-picker';
import { ExtendedColumnMeta } from '@/types/app/extendedColumnMeta';
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const columns: ColumnDef<Violation>[] = [
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
        accessorKey: "student.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama Siswa" />
        ),
        cell: ({ getValue }) => <span className='truncate'>{getValue() as string}</span>,
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
            label: 'Nama Siswa',
        } as ExtendedColumnMeta<Violation>,
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
        } as ExtendedColumnMeta<Violation>,
    },
    {
        accessorKey: 'violation_type.name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Jenis Pelanggaran" />
        ),
        cell: ({ getValue }) => <span className='truncate'>{getValue() as string}</span>,
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
            label: 'Jenis Pelanggaran',
        } as ExtendedColumnMeta<Violation>,
    },
    {
        accessorKey: 'violation_date',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tanggal Pelanggaran" />
        ),
        cell: ({ row }) => {
            const date = row.getValue('violation_date') as string;
            return <span className='truncate'>{format(new Date(date), 'dd MMMM yyyy', { locale: id })}</span>
        },
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
            label: 'Tanggal Pelanggaran',
        } as ExtendedColumnMeta<Violation>,
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
                    case 'approved':
                        return 'default';
                    case 'cancelled':
                        return 'destructive';
                    case 'pending':
                        return 'secondary';
                    default:
                        return 'outline';
                }
            };

            const getLabel = (status: string) => {
                switch (status) {
                    case 'approved':
                        return 'Disetujui';
                    case 'cancelled':
                        return 'Dibatalkan';
                    case 'pending':
                        return 'Menunggu';
                    default:
                        return status;
                }
            };

            return (
                <Badge variant={getVariant(status)} className='truncate'>
                    {getLabel(status)}
                </Badge>
            );
        },
        enableColumnFilter: true,
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
        meta: {
            label: 'Status',
        } as ExtendedColumnMeta<Violation>,
    },
    {
        accessorKey: 'description',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Deskripsi" />
        ),
        cell: ({ row }) => <div className="truncate max-w-[300px]">{row.getValue('description')}</div>,
        enableColumnFilter: true,
        meta: {
            label: 'Deskripsi',
        } as ExtendedColumnMeta<Violation>,
    },
    {
        accessorKey: 'sanction_notes',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Catatan Sanksi" />
        ),
        cell: ({ row }) => {
            const violation = row.original; // Get the original violation object
            const notes = violation.sanction_notes;
            const startDate = violation.sanction_start_date;
            const endDate = violation.sanction_end_date;

            if (!notes && !startDate) return '-';

            return (
                <div className="space-y-1 max-w-[300px]">
                    {notes && <div className="truncate">{notes}</div>}
                    {startDate && (
                        <div className="text-sm text-muted-foreground">
                            {format(new Date(startDate), 'dd MMM yyyy', { locale: id })}
                            {endDate && ` - ${format(new Date(endDate), 'dd MMM yyyy', { locale: id })}`}
                        </div>
                    )}
                </div>
            );
        },
        enableColumnFilter: true,
        meta: {
            label: 'Catatan Sanksi',
        } as ExtendedColumnMeta<Violation>,
    },
    {
        accessorKey: 'document_path',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Dokumen" />
        ),
        cell: ({ row }) => {
            const path = row.getValue('document_path') as string;
            return path ? (
                <Button
                    variant="link"
                    className="px-0"
                    onClick={() => window.open(path, '_blank')}
                >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Lihat Dokumen
                </Button>
            ) : '-';
        },
        meta: {
            label: 'Dokumen',
        } as ExtendedColumnMeta<Violation>,
    },
    {
        accessorKey: 'creator.name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Dibuat Oleh" />
        ),
        cell: ({ getValue }) => <span className='truncate'>{getValue() as string}</span>,
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
            label: 'Dibuat Oleh',
        } as ExtendedColumnMeta<Violation>,
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
        accessorKey: 'violation_type_id',
        header: 'Id tipe',
        cell: ({ row }) => (
            <div>{row.original.violation_type?.id || '-'}</div>
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
        enableHiding: true,
    },
];
