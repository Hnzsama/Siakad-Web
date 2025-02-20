import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'
import { DataTableCustomFacetedFilter } from './data-table-customFaceted-filter'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { IconTrash } from '@tabler/icons-react'
import React from 'react'
import { useResourceContext } from '../context/context'
import { School } from '../data/schema'
import { Data } from '../data/data'
import { DatePickerWithRange } from '@/components/DatePickerWithRange'
import { debounce } from 'lodash'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
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
    const { provinceFilter, regencyFilter, districtFilter, levelFilter } = Data()
    const [selectedIds, setSelectedIds] = React.useState<string[]>([])
    const [selectedProvinces, setSelectedProvinces] = React.useState<number[]>([]);
    const [selectedRegencies, setSelectedRegencies] = React.useState<number[]>([]);

    React.useEffect(() => {
        const selectedIds = table.getFilteredSelectedRowModel().rows.map(row => (row.original as School).id)
        setSelectedIds(selectedIds)
    }, [rowSelection])

    return (
        <div className='flex items-center justify-between'>
            <div className='overflow-x-auto'>
                <ScrollArea>
                    <div className='flex flex-col items-start flex-1 py-0.5 gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
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
                                        const selectedRow = table.getFilteredSelectedRowModel().rows[0]?.original as School

                                        const currentRow: School = {
                                            ...selectedRow,
                                            selectedIds: selectedIds,
                                            name: `${selectedIds.length} selected schools`
                                        }

                                        setCurrentRow(currentRow)
                                        setOpen('delete')
                                    }}
                                >
                                    <IconTrash className='w-4 h-4' />
                                    <span className='hidden ml-2 sm:inline'>
                                        {selectedIds.length > 1 ? `Hapus (${selectedIds.length})` : 'Hapus'}
                                    </span>
                                </Button>
                            )}
                        </div>
                        <div className="flex-wrap gap-x-2">
                            <div className="flex gap-x-2">
                                {table.getColumn('province_code') && (
                                    <DataTableCustomFacetedFilter
                                        column={table.getColumn('province_code')}
                                        title="Provinsi"
                                        options={provinceFilter}
                                        onSelect={(values) => {
                                            setSelectedProvinces(values);
                                            setSelectedRegencies([]);
                                            table.getColumn('regency_code')?.setFilterValue(undefined);
                                            table.getColumn('district_code')?.setFilterValue(undefined);
                                        }}
                                    />
                                )}

                                {table.getColumn('regency_code') && (
                                    <DataTableCustomFacetedFilter
                                        column={table.getColumn('regency_code')}
                                        title="Kabupaten/Kota"
                                        options={regencyFilter}
                                        selectedProvinces={selectedProvinces}
                                        disabled={selectedProvinces.length === 0}
                                        onSelect={(values) => {
                                            setSelectedRegencies(values);
                                            table.getColumn('district_code')?.setFilterValue(undefined);
                                        }}
                                    />
                                )}

                                {table.getColumn('district_code') && (
                                    <DataTableCustomFacetedFilter
                                        column={table.getColumn('district_code')}
                                        title="Kecamatan"
                                        options={districtFilter}
                                        selectedRegencies={selectedRegencies}
                                        disabled={selectedRegencies.length === 0}
                                    />
                                )}

                                {table.getColumn('schoolLevel') && (
                                    <DataTableFacetedFilter
                                        column={table.getColumn('schoolLevel')}
                                        title="Jenjang"
                                        options={levelFilter}
                                    />
                                )}
                            </div>
                        </div>
                        {isFiltered && (
                            <Button
                                variant='ghost'
                                onClick={() => {
                                    table.resetColumnFilters();
                                    setSelectedProvinces([]);
                                    setSelectedRegencies([]);
                                }}
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
