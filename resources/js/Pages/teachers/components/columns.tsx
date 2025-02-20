import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format, isWithinInterval } from 'date-fns';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Teacher } from '../data/schema';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { Data } from '../data/data';
import { ExtendedColumnMeta } from '@/types/app/extendedColumnMeta';

export const columns: ColumnDef<Teacher>[] = [
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
    accessorKey: 'nip',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='NIP' />
    ),
    cell: ({ row }) => (
      <div className='font-medium truncate'>{row.getValue('nip')}</div>
    ),
    enableColumnFilter: true,
    meta: {
      label: 'NIP',
    } as ExtendedColumnMeta<Teacher>,
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
    } as ExtendedColumnMeta<Teacher>,
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
    } as ExtendedColumnMeta<Teacher>,
  },
  {
    accessorKey: 'subject',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mata Pelajaran' />
    ),
    cell: ({ row }) => (
      <div className='truncate'>{row.getValue('subject') || '-'}</div>
    ),
    enableColumnFilter: true,
    meta: {
      label: 'Mata Pelajaran',
    } as ExtendedColumnMeta<Teacher>,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='No. Telepon' />
    ),
    cell: ({ row }) => (
      <div className='truncate'>{row.getValue('phone') || '-'}</div>
    ),
    enableColumnFilter: true,
    meta: {
      label: 'No. Telepon',
    } as ExtendedColumnMeta<Teacher>,
  },
  {
    accessorKey: 'shift.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Shift' />
    ),
    cell: ({ getValue }) => <span className='truncate'>{getValue() as string}</span>,
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: 'Shift',
    } as ExtendedColumnMeta<Teacher>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status')
      return (
        <Badge variant={status ? 'default' : 'secondary'}>
          {status ? 'Aktif' : 'Nonaktif'}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableColumnFilter: true,
    meta: {
      label: 'Status',
    } as ExtendedColumnMeta<Teacher>,
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
    accessorKey: 'shift_id',
    header: 'Id Shift',
    cell: ({ row }) => (
      <div>{row.original.shift?.id || '-'}</div>
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
