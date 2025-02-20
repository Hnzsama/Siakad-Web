import React from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'
import { Data } from '../data/data'
import { DatePickerWithRange } from '@/components/DatePickerWithRange'
import { Guardian } from '../data/schema'
import { IconTrash } from '@tabler/icons-react'
import { useResourceContext } from '../context/context'
import { DebouncedInput } from '@/components/DebouncedInput'

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const { setOpen, setCurrentRow } = useResourceContext()
    const { rowSelection } = table.getState()
    const { genderFilter, statusFilter } = Data()
    const [selectedIds, setSelectedIds] = React.useState<string[]>([])

    React.useEffect(() => {
        const selectedIds = table.getFilteredSelectedRowModel().rows.map(row => (row.original as Guardian).id)
        setSelectedIds(selectedIds)
    }, [rowSelection])

    return (
        <div className='flex items-center justify-between'>
            <div className='flex flex-col-reverse items-start flex-1 gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
                <div className='flex space-x-2'>
                    <DatePickerWithRange table={table} />
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
                                const selectedRow = table.getFilteredSelectedRowModel().rows[0]?.original as Guardian

                                const currentRow: Guardian = {
                                    ...selectedRow,
                                    selectedIds: selectedIds,
                                    name: `${selectedIds.length} selected semester`
                                }

                                setCurrentRow(currentRow)
                                setOpen('delete')
                            }}
                        >
                            <IconTrash className='w-4 h-4' />
                            <span className='hidden ml-2 sm:inline'>
                                {selectedIds.length > 1 ? `Delete (${selectedIds.length})` : 'Delete'}
                            </span>
                        </Button>
                    )}
                </div>
                <div className='flex gap-x-2'>
                    {table.getColumn('gender') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('gender')}
                            title='Jenis Kelamin'
                            options={genderFilter.map((t) => ({ ...t }))}
                        />
                    )}
                    {table.getColumn('status') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('status')}
                            title='Status'
                            options={statusFilter.map((t) => ({ ...t }))}
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
            <DataTableViewOptions table={table} />
        </div>
    )
}
