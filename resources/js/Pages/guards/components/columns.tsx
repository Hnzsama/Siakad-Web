import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { guardTypes, permissionCounts, lastUpdatedFilters } from '../data/data'
import { Role } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { ExtendedColumnMeta } from '@/types/app/extendedColumnMeta'

export const columns: ColumnDef<Role>[] = [
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
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Nama' />
        ),
        cell: ({ row }) => {
            return (
                <div className='flex space-x-2'>
                    <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
                        {row.getValue('name')}
                    </span>
                </div>
            )
        },
        enableColumnFilter: true,
        meta: {
            label: 'Nama',
        } as ExtendedColumnMeta<Role>,
    },
    {
        accessorKey: 'guard_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Pelindung' />
        ),
        cell: ({ row }) => {
            const guardType = guardTypes.find(
                (guard) => guard.value === row.getValue('guard_name')
            )

            if (!guardType) {
                return (
                    <div className='flex w-[100px] items-center'>
                        <span>{row.getValue('guard_name')}</span>
                    </div>
                )
            }

            return (
                <div className='flex w-[100px] items-center'>
                    <guardType.icon className='w-4 h-4 mr-2 text-muted-foreground' />
                    <span>{guardType.label}</span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        meta: {
            label: 'Pelindung',
            filterVariant: 'select',
        } as ExtendedColumnMeta<Role>,
    },
    {
        accessorKey: 'permissions_count',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Permissions' />
        ),
        cell: ({ row }) => {
            const count = row.getValue('permissions_count') as number
            let range = permissionCounts[0]

            if (count > 5 && count <= 15) {
                range = permissionCounts[1]
            } else if (count > 15) {
                range = permissionCounts[2]
            }

            return (
                <div className='flex items-center'>
                    <range.icon className='w-4 h-4 mr-2 text-muted-foreground' />
                    <span>{count}</span>
                </div>
            )
        },
        meta: {
            label: 'Izin',
        } as ExtendedColumnMeta<Role>,
    },
    {
        accessorKey: 'updated_at',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Terakhir diubah' />
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue('updated_at'))
            const now = new Date()
            const diffTime = Math.abs(now.getTime() - date.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            let filter = lastUpdatedFilters[2]
            if (diffDays <= 1) {
                filter = lastUpdatedFilters[0]
            } else if (diffDays <= 7) {
                filter = lastUpdatedFilters[1]
            }

            return (
                <div className='flex items-center'>
                    <filter.icon className='w-4 h-4 mr-2 text-muted-foreground' />
                    <span>{date.toLocaleDateString()}</span>
                </div>
            )
        },
        meta: {
            label: 'Terakhir diubah',
        } as ExtendedColumnMeta<Role>,
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
        enableHiding: true
    },
]
