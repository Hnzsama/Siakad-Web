import React from 'react'
import {
    ArrowDownIcon,
    ArrowUpIcon,
    CaretSortIcon,
    EyeNoneIcon,
} from '@radix-ui/react-icons'
import { Column } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>
    title: string
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>
    }

    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='ghost'
                        size='sm'
                        className='-ml-3 h-8 data-[state=open]:bg-accent'
                    >
                        <span>{title}</span>
                        {column.getIsSorted() === 'desc' ? (
                            <ArrowDownIcon className='w-4 h-4 ml-2' />
                        ) : column.getIsSorted() === 'asc' ? (
                            <ArrowUpIcon className='w-4 h-4 ml-2' />
                        ) : (
                            <CaretSortIcon className='w-4 h-4 ml-2' />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start'>
                    <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                        <ArrowUpIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                        <ArrowDownIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
                        Desc
                    </DropdownMenuItem>
                    {column.getCanHide() && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                                <EyeNoneIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
                                Hide
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            {/* {column.getCanFilter() && <Filter column={column} />} */}
        </div>
    )
}

// function Filter({ column }: { column: Column<any, unknown> }) {
//     const { filterVariant } = column.columnDef.meta ?? {}

//     const columnFilterValue = column.getFilterValue()

//     const sortedUniqueValues = React.useMemo(
//         () =>
//             filterVariant === 'range'
//                 ? []
//                 : Array.from(column.getFacetedUniqueValues().keys())
//                     .sort()
//                     .slice(0, 5000),
//         [column.getFacetedUniqueValues(), filterVariant]
//     )

//     return filterVariant === 'range' ? (
//         <div>
//             <div className="flex space-x-2">
//                 <DebouncedInput
//                     type="number"
//                     min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
//                     max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
//                     value={(columnFilterValue as [number, number])?.[0] ?? ''}
//                     onChange={value =>
//                         column.setFilterValue((old: [number, number]) => [value, old?.[1]])
//                     }
//                     placeholder={`Min ${column.getFacetedMinMaxValues()?.[0] !== undefined
//                         ? `(${column.getFacetedMinMaxValues()?.[0]})`
//                         : ''
//                         }`}
//                     className="w-24 border rounded shadow"
//                 />
//                 <DebouncedInput
//                     type="number"
//                     min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
//                     max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
//                     value={(columnFilterValue as [number, number])?.[1] ?? ''}
//                     onChange={value =>
//                         column.setFilterValue((old: [number, number]) => [old?.[0], value])
//                     }
//                     placeholder={`Max ${column.getFacetedMinMaxValues()?.[1]
//                         ? `(${column.getFacetedMinMaxValues()?.[1]})`
//                         : ''
//                         }`}
//                     className="w-24 border rounded shadow"
//                 />
//             </div>
//             <div className="h-1" />
//         </div>
//     ) : filterVariant === 'select' ? (
//         <Select
//             value={columnFilterValue?.toString()}
//             onValueChange={(value) => column.setFilterValue(value)}
//         >
//             <SelectTrigger className="w-36">
//                 <SelectValue placeholder="Select an option" />
//             </SelectTrigger>
//             <SelectContent>
//                 <SelectItem value="all">All</SelectItem>
//                 {sortedUniqueValues.map(value => (
//                     <SelectItem key={value} value={value}>
//                         {value}
//                     </SelectItem>
//                 ))}
//             </SelectContent>
//         </Select>
//     ) : (
//         <>
//             <datalist id={column.id + 'list'}>
//                 {sortedUniqueValues.map((value: any) => (
//                     <option value={value} key={value} />
//                 ))}
//             </datalist>
//             <DebouncedInput
//                 type="text"
//                 value={(columnFilterValue ?? '') as string}
//                 onChange={value => column.setFilterValue(value)}
//                 placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
//                 className="border rounded shadow w-36"
//                 list={column.id + 'list'}
//             />
//             <div className="h-1" />
//         </>
//     )
// }

// // A typical debounced input react component
// function DebouncedInput({
//     value: initialValue,
//     onChange,
//     debounce = 500,
//     ...props
// }: {
//     value: string | number
//     onChange: (value: string | number) => void
//     debounce?: number
// } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
//     const [value, setValue] = React.useState(initialValue)

//     React.useEffect(() => {
//         setValue(initialValue)
//     }, [initialValue])

//     React.useEffect(() => {
//         const timeout = setTimeout(() => {
//             onChange(value)
//         }, debounce)

//         return () => clearTimeout(timeout)
//     }, [value])

//     return (
//         <Input {...props} value={value} onChange={e => setValue(e.target.value)} />
//     )
// }
