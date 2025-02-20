import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format, isWithinInterval } from 'date-fns';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { SubjectTeacher } from '../data/schema';
import { DateRange } from 'react-day-picker';
import { ExtendedColumnMeta } from '@/types/app/extendedColumnMeta';

export const columns: ColumnDef<SubjectTeacher>[] = [
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
        accessorKey: 'subject.name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Mata Pelajaran' />
        ),
        cell: ({ getValue }) => <span className='truncate'>{getValue() as string}</span>,
        enableColumnFilter: true,
        meta: {
            label: 'Mata Pelajaran',
        } as ExtendedColumnMeta<SubjectTeacher>,
    },
    {
        accessorKey: 'teacher.name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Guru' />
        ),
        cell: ({ getValue }) => <span className='truncate'>{getValue() as string}</span>,
        enableColumnFilter: true,
        meta: {
            label: 'Guru',
        } as ExtendedColumnMeta<SubjectTeacher>,
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
        accessorKey: 'subject_id',
        header: 'Id Mapel',
        cell: ({ row }) => (
            <div>{row.original.subject?.id || '-'}</div>
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
        accessorKey: 'teacher_id',
        header: 'Id Guru',
        cell: ({ row }) => (
            <div>{row.original.teacher?.id || '-'}</div>
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
        enableHiding: true
    },
];
