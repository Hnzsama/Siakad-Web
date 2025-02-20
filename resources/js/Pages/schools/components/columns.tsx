import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { School } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { ExtendedColumnMeta } from '@/types/app/extendedColumnMeta'
import { Badge } from '@/components/ui/badge'
import { format, isWithinInterval } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from '@/lib/utils'
import { Data } from '../data/data'

export const columns: ColumnDef<School>[] = [
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
        enablePinning: true,
        meta: {
            className: cn(
                'sticky left-0 z-50 bg-background',
            ),
        },
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <div className='pl-2'>
                <DataTableColumnHeader column={column} title='Nama' />
            </div>
        ),
        cell: ({ row }) => {
            return (
                <div className='flex pl-2 space-x-2 p-'>
                    <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
                        {row.getValue('name')}
                    </span>
                </div>
            )
        },
        enableHiding: false,
        enableColumnFilter: true,
        enablePinning: true,
        meta: {
            label: 'Nama',
            className: cn(
                'sticky left-6 z-40 bg-background border-r shadow-md',
            ),
        } as ExtendedColumnMeta<School>,
    },
    {
        accessorKey: 'npsn',
        header: ({ column }) => (
                <DataTableColumnHeader column={column} title='NPSN' />
        ),
        cell: ({ row }) => {
            return (
                <div className='flex space-x-2'>
                    <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
                        {row.getValue('npsn')}
                    </span>
                </div>
            )
        },
        enableColumnFilter: true,
        meta: {
            label: 'Npsn',
            className: cn(
                'pl-4'
            ),
        } as ExtendedColumnMeta<School>,
    },
    {
        accessorKey: 'schoolLevel',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Jenjang' />
        ),
        cell: ({ row }) => {
            const { levelFilter } = Data()
            const levelValue = row.getValue('schoolLevel')

            const matchedLevel = levelFilter.find(item => item.value === levelValue)

            return (
                <div className="flex space-x-2">
                    <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
                        {matchedLevel ? matchedLevel.label : "Unknown Level"}
                    </span>
                </div>
            )
        },
        enableColumnFilter: true,
        enableGlobalFilter: false,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        meta: {
            label: 'Jenjang',
        } as ExtendedColumnMeta<School>,
    },
    {
        accessorKey: 'address',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Alamat' />
        ),
        cell: ({ row }) => {
            return (
                <div className='flex space-x-2'>
                    <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
                        {row.getValue('address')}
                    </span>
                </div>
            )
        },
        enableColumnFilter: true,
        meta: {
            label: 'Alamat',
        } as ExtendedColumnMeta<School>,
    },
    {
        accessorKey: 'province_code',
        header: 'Province Code',
        enableColumnFilter: false,
        enableSorting: false,
        enableHiding: false,
        enableGlobalFilter: false,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'regency_code',
        header: 'Regency Code',
        enableColumnFilter: false,
        enableSorting: false,
        enableHiding: false,
        enableGlobalFilter: false,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'district_code',
        header: 'District Code',
        enableColumnFilter: false,
        enableSorting: false,
        enableHiding: false,
        enableGlobalFilter: false,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'province.name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Provinsi' />
        ),
        cell: ({ row }) => {
            const province = row.original.province
            return (
                <div className='flex space-x-2'>
                    <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
                        {province?.name || '-'}
                    </span>
                </div>
            )
        },
        enableColumnFilter: true,
        enableGlobalFilter: false,
        meta: {
            label: 'Provinsi',
        } as ExtendedColumnMeta<School>,
    },
    {
        accessorKey: 'regency.name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Kota' />
        ),
        cell: ({ row }) => {
            const regency = row.original.regency
            return (
                <div className='flex space-x-2'>
                    <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
                        {regency?.name || '-'}
                    </span>
                </div>
            )
        },
        enableColumnFilter: true,
        enableGlobalFilter: false,
        meta: {
            label: 'Kota',
        } as ExtendedColumnMeta<School>,
    },
    {
        accessorKey: 'district.name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Kecamatan' />
        ),
        cell: ({ row }) => {
            const district = row.original.district
            return (
                <div className='flex space-x-2'>
                    <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
                        {district?.name || '-'}
                    </span>
                </div>
            )
        },
        enableColumnFilter: true,
        enableGlobalFilter: false,
        meta: {
            label: 'Kecamatan',
        } as ExtendedColumnMeta<School>,
    },
    {
        accessorKey: 'postal_code',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Kode Pos' />
        ),
        cell: ({ row }) => {
            return (
                <div className='flex space-x-2'>
                    <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
                        {row.getValue('postal_code')}
                    </span>
                </div>
            )
        },
        enableColumnFilter: true,
        enableGlobalFilter: false,
        meta: {
            label: 'Kode Pos',
        } as ExtendedColumnMeta<School>,
    },
    {
        accessorKey: 'phone',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Telepon' />
        ),
        cell: ({ row }) => {
            return (
                <div className='flex space-x-2'>
                    <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
                        {row.getValue('phone')}
                    </span>
                </div>
            )
        },
        enableColumnFilter: true,
        meta: {
            label: 'Telepon',
        } as ExtendedColumnMeta<School>,
    },
    {
        accessorKey: 'email',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Email' />
        ),
        cell: ({ row }) => {
            return (
                <div className='flex space-x-2'>
                    <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
                        {row.getValue('email')}
                    </span>
                </div>
            )
        },
        enableColumnFilter: true,
        meta: {
            label: 'Email',
        } as ExtendedColumnMeta<School>,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ row }) => {
            const status = row.getValue('status');
            return (
                <div className='flex space-x-2'>
                    <span className={`max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]`}>
                        <Badge variant={`${status ? 'default' : 'destructive'}`}>
                            {status ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                    </span>
                </div>
            )
        },
        enableColumnFilter: true,
        meta: {
            label: 'Status',
        } as ExtendedColumnMeta<School>,
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => format(new Date(row.getValue("created_at")), "LLL dd, y"),
        filterFn: (row, id, filterValue: DateRange | undefined) => {
            if (!filterValue?.from) return true;

            const rowDate = new Date(row.getValue(id));
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
        enableHiding: true
    },
]
