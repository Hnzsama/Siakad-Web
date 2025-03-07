import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface DataTablePaginationProps<TData> {
    table: Table<TData>
}

export function DataTablePagination<TData>({
    table,
}: DataTablePaginationProps<TData>) {
    return (
        <div className='flex items-center justify-between overflow-auto'>
            <div className='flex-1 hidden text-sm text-muted-foreground sm:block'>
                {table.getFilteredSelectedRowModel().rows.length} dari{' '}
                {table.getFilteredRowModel().rows.length} baris terpilih.
            </div>
            <div className='flex items-center sm:space-x-6 lg:space-x-8'>
                <div className='flex items-center space-x-2'>
                    <p className='hidden text-sm font-medium sm:block'>Data per halaman</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger className='h-8 w-[70px]'>
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side='top'>
                            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex w-[100px] text-nowrap items-center justify-center text-sm font-medium'>
                    Halaman {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                </div>
                <div className='flex items-center space-x-2'>
                    <Button
                        variant='outline'
                        className='hidden w-8 h-8 p-0 lg:flex'
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className='sr-only'>Go to first page</span>
                        <DoubleArrowLeftIcon className='w-4 h-4' />
                    </Button>
                    <Button
                        variant='outline'
                        className='w-8 h-8 p-0'
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className='sr-only'>Go to previous page</span>
                        <ChevronLeftIcon className='w-4 h-4' />
                    </Button>
                    <Button
                        variant='outline'
                        className='w-8 h-8 p-0'
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className='sr-only'>Go to next page</span>
                        <ChevronRightIcon className='w-4 h-4' />
                    </Button>
                    <Button
                        variant='outline'
                        className='hidden w-8 h-8 p-0 lg:flex'
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className='sr-only'>Go to last page</span>
                        <DoubleArrowRightIcon className='w-4 h-4' />
                    </Button>
                </div>
            </div>
        </div>
    )
}
