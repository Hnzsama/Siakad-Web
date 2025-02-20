import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'
import { guardTypes } from '../data/data'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { IconTrash } from '@tabler/icons-react'
import React from 'react'
import { useRoles } from '../context/roles-context'
import { Role } from '../data/schema'
import { DebouncedInput } from '@/components/DebouncedInput'

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const { setOpen, setCurrentRow } = useRoles()
    const { rowSelection } = table.getState()
    const [selectedIds, setSelectedIds] = React.useState<number[]>([])

    React.useEffect(() => {
        const selectedIds = table.getFilteredSelectedRowModel().rows.map(row => (row.original as Role).id)
        setSelectedIds(selectedIds)
    }, [rowSelection])

    return (
        <div className='flex items-center justify-between'>
            <div className='overflow-x-auto'>
                <ScrollArea>
                    <div className='flex flex-1 flex-col-reverse items-start gap-y-2 px-[0.055rem] py-0.5 sm:flex-row sm:items-center sm:space-x-2'>
                        <DebouncedInput
                            value={table.getState().globalFilter ?? ''}
                            onChange={value => table.setGlobalFilter(String(value))}
                            className='h-8 w-[150px] lg:w-[250px]'
                            placeholder="Search all columns..."
                        />
                        {Object.keys(rowSelection).length > 0 && (
                            <Button
                                variant='destructive'
                                className='h-8 px-2 lg:px-3'
                                onClick={() => {
                                    setCurrentRow({
                                        id: selectedIds[0],
                                        name: `${selectedIds.length} selected roles`,
                                        guard_name: '',
                                        permission_count: selectedIds.length,
                                        permissions: null,
                                        updated_at: null,
                                        selectedIds: selectedIds
                                    })
                                    setOpen('delete')
                                }}
                            >
                                <IconTrash className='w-4 h-4' />
                                <span className='hidden ml-2 sm:inline'>
                                    {selectedIds.length > 1 ? `Hapus (${selectedIds.length})` : 'Hapus'}
                                </span>
                            </Button>
                        )}
                        <div className='flex gap-x-2'>
                            {table.getColumn('guard_name') && (
                                <DataTableFacetedFilter
                                    column={table.getColumn('guard_name')}
                                    title='Pelindung'
                                    options={guardTypes}
                                />
                            )}
                        </div>
                        {isFiltered && (
                            <Button
                                variant='ghost'
                                onClick={() => table.resetColumnFilters()}
                                className='h-8 px-2 lg:px-3'
                            >
                                Reset
                                <Cross2Icon className='w-4 h-4 ml-2' />
                            </Button>
                        )}
                    </div>
                    <ScrollBar orientation='horizontal' />
                </ScrollArea>
            </div>
            <DataTableViewOptions table={table} />
        </div>
    )
}
