import * as React from 'react'
import {
    Column,
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useRoles } from '../context/roles-context'
import { ExtendedColumn } from '@/types/app/extendedColumnMeta'
import { cn } from '@/lib/utils'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onTableInstance?: (instance: any) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onTableInstance,
}: DataTableProps<TData, TValue>) {
    const { permissions } = useRoles()

    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({
            select: permissions.delete,
            actions: permissions.delete || permissions.update,
        })
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [sorting, setSorting] = React.useState<SortingState>([])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    React.useEffect(() => {
        if (onTableInstance) {
            onTableInstance(table);
        }
    }, [table, onTableInstance]);

    return (
        <div className='space-y-4'>
            <DataTableToolbar table={table} />
            <div className='border rounded-md'>
                <ScrollArea>
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        const isFirstVisibleColumn = header.column.id === table.getVisibleFlatColumns()[0].id;
                                        return (
                                            <TableHead
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                className={cn(
                                                    (header.column.columnDef.meta as ExtendedColumn)?.className,
                                                    isFirstVisibleColumn && !columnVisibility.select && 'pl-4'
                                                )}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && 'selected'}
                                    >
                                        {row.getVisibleCells().map((cell) => {
                                            const isFirstVisibleColumn = cell.column.id === table.getVisibleFlatColumns()[0].id;
                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    className={cn((
                                                        cell.column.columnDef.meta as ExtendedColumn)?.className,
                                                        isFirstVisibleColumn && !columnVisibility.select && 'pl-4'
                                                    )}
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className='h-24 text-center'
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <ScrollBar orientation='horizontal' />
                </ScrollArea>
            </div>
            <DataTablePagination
                table={table}
            />
        </div>
    )
}
