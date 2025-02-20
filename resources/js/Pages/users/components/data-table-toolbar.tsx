import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'
import { Data } from '../data/data'
import { DatePickerWithRange } from '@/components/DatePickerWithRange'
import { DebouncedInput } from '@/components/DebouncedInput'

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataTableToolbar<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    const { userTypes } = Data()

    return (
        <div className='flex items-center justify-between'>
            <div className='flex flex-col-reverse items-start flex-1 gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
                <DatePickerWithRange table={table} />
                <DebouncedInput
                    value={table.getState().globalFilter ?? ''}
                    onChange={value => table.setGlobalFilter(String(value))}
                    className='h-8 w-[150px] lg:w-[250px]'
                    placeholder="Search all columns..."
                />
                <div className='flex gap-x-2'>
                    {table.getColumn('status') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('status')}
                            title='Status'
                            options={[
                                { label: 'Aktif', value: 1 },
                                { label: 'Tidak aktif', value: 2 },
                            ]}
                        />
                    )}
                    {/* {table.getColumn('role') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('role')}
                            title='Role'
                            options={userTypes.map((t) => ({ ...t }))}
                        />
                    )} */}
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
