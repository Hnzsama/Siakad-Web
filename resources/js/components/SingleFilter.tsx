import { Column, RowData } from "@tanstack/react-table"
import React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Input } from "./ui/input"
import { DebouncedInput } from "./DebouncedInput"

declare module '@tanstack/react-table' {
    //allows us to define custom properties for our columns
    interface ColumnMeta<TData extends RowData, TValue> {
      filterVariant?: 'text' | 'range' | 'select',
      className?: string
    }
  }

export function SingleFilter({ column }: { column: Column<any, unknown> }) {
    const { filterVariant } = column.columnDef.meta ?? {}

    const columnFilterValue = column.getFilterValue()

    const sortedUniqueValues = React.useMemo(
        () =>
            filterVariant === 'range'
                ? []
                : Array.from(column.getFacetedUniqueValues().keys())
                    .sort()
                    .slice(0, 5000),
        [column.getFacetedUniqueValues(), filterVariant]
    )

    return filterVariant === 'range' ? (
        <div>
            <div className="flex space-x-2">
                <DebouncedInput
                    type="number"
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                    value={(columnFilterValue as [number, number])?.[0] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [value, old?.[1]])
                    }
                    placeholder={`Min ${column.getFacetedMinMaxValues()?.[0] !== undefined
                        ? `(${column.getFacetedMinMaxValues()?.[0]})`
                        : ''
                        }`}
                    className="w-24 border rounded shadow"
                />
                <DebouncedInput
                    type="number"
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                    value={(columnFilterValue as [number, number])?.[1] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [old?.[0], value])
                    }
                    placeholder={`Max ${column.getFacetedMinMaxValues()?.[1]
                        ? `(${column.getFacetedMinMaxValues()?.[1]})`
                        : ''
                        }`}
                    className="w-24 border rounded shadow"
                />
            </div>
            <div className="h-1" />
        </div>
    ) : filterVariant === 'select' ? (
        <Select
            value={columnFilterValue?.toString()}
            onValueChange={(value) => column.setFilterValue(value)}
        >
            <SelectTrigger className="w-36">
                <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {sortedUniqueValues.map(value => (
                    <SelectItem key={value} value={value}>
                        {value}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    ) : (
        <>
            <datalist id={column.id + 'list'}>
                {sortedUniqueValues.map((value: any) => (
                    <option value={value} key={value} />
                ))}
            </datalist>
            <DebouncedInput
                type="text"
                value={(columnFilterValue ?? '') as string}
                onChange={value => column.setFilterValue(value)}
                placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
                className="border rounded shadow w-36"
                list={column.id + 'list'}
            />
            <div className="h-1" />
        </>
    )
}
