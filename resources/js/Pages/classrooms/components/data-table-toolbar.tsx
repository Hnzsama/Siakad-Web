import React from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'
import { Data } from '../data/data'
import { DatePickerWithRange } from '@/components/DatePickerWithRange'
import { Classroom } from '../data/schema'
import { IconTrash } from '@tabler/icons-react'
import { useResourceContext } from '../context/context'
import { DebouncedInput } from '@/components/DebouncedInput'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const { setOpen, setCurrentRow } = useResourceContext()
    const { rowSelection } = table.getState()
    const { classLevelFilter, majorFilter, shiftFilter, studyGroupFilter } = Data()
    const [selectedIds, setSelectedIds] = React.useState<string[]>([])

    React.useEffect(() => {
        const selectedIds = table.getFilteredSelectedRowModel().rows.map(row => (row.original as Classroom).id)
        setSelectedIds(selectedIds)
    }, [rowSelection])

    return (
        <div className='flex items-center justify-between'>
            <div className='overflow-x-auto'>
                <ScrollArea>
                    <div className='flex flex-col-reverse items-start flex-1 gap-y-2 sm:flex-row sm:items-center sm:space-x-2 py-0.5'>
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
                                        const selectedRow = table.getFilteredSelectedRowModel().rows[0]?.original as Classroom

                                        const currentRow: Classroom = {
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
                            {table.getColumn('major_id') && (
                                <DataTableFacetedFilter
                                    column={table.getColumn('major_id')}
                                    title='Jurusan'
                                    options={majorFilter.map((t) => ({ ...t }))}
                                />
                            )}
                            {table.getColumn('shift_id') && (
                                <DataTableFacetedFilter
                                    column={table.getColumn('shift_id')}
                                    title='Shift'
                                    options={shiftFilter.map((t) => ({ ...t }))}
                                />
                            )}
                            {table.getColumn('study_group_id') && (
                                <DataTableFacetedFilter
                                    column={table.getColumn('study_group_id')}
                                    title='Kelompok Belajar'
                                    options={studyGroupFilter.map((t) => ({ ...t }))}
                                />
                            )}
                            {table.getColumn('class_level_id') && (
                                <DataTableFacetedFilter
                                    column={table.getColumn('class_level_id')}
                                    title='Tingkat'
                                    options={classLevelFilter.map((t) => ({ ...t }))}
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
