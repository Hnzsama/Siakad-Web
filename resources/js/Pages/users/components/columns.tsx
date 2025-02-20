import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { User } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { ExtendedColumnMeta } from '@/types/app/extendedColumnMeta'
import { Badge } from '@/components/ui/badge'
import { format, isWithinInterval } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from '@/lib/utils'
import { Data } from '../data/data'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const columns: ColumnDef<User>[] = [
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
                <div className='flex pl-2 space-x-2 p-'> {/* Added pl-4 for padding-left */}
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
                'sticky left-6 z-40 bg-background',
            ),
        } as ExtendedColumnMeta<User>,
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
            className: cn(
                'pl-4'
            ),
        } as ExtendedColumnMeta<User>,
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
        } as ExtendedColumnMeta<User>,
    },
    {
        accessorKey: 'avatar_url',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Avatar' />
        ),
        cell: ({ row }) => {
            const avatarUrl = row.getValue('avatar_url') as string
            const name = row.getValue('name') as string

            // Get initials from name (takes first letter of each word)
            const initials = name
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .slice(0, 2) // Only take first two initials

            return (
                <div className="flex items-center">
                    <Avatar className='rounded-full'>
                        <AvatarImage src={avatarUrl} alt={name} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </div>
            )
        },
        enableColumnFilter: true,
        meta: {
            label: 'Avatar',
        } as ExtendedColumnMeta<User>,
    },
    {
        accessorKey: 'email_verified_at',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Terverifikasi' />
        ),
        cell: ({ row }) => {
            return (
                <div className='flex space-x-2'>
                    <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
                        {row.getValue('email_verified_at')}
                    </span>
                </div>
            )
        },
        enableColumnFilter: true,
        meta: {
            label: 'Terverifikasi',
        } as ExtendedColumnMeta<User>,
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
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        meta: {
            label: 'Status',
        } as ExtendedColumnMeta<User>,
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
