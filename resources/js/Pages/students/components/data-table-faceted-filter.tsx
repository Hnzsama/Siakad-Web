import * as React from 'react'
import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import { Column } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

interface DataTableFacetedFilterProps<TData, TValue> {
    column?: Column<TData, TValue>
    title?: string
    options: {
        label: string
        value: string | number | null  // Updated to allow null
        icon?: React.ComponentType<{ className?: string }>
    }[]
    includeEmpty?: boolean  // New prop to control empty value filtering
}

export function DataTableFacetedFilter<TData, TValue>({
    column,
    title,
    options,
    includeEmpty = false,
}: DataTableFacetedFilterProps<TData, TValue>) {
    const facets = column?.getFacetedUniqueValues()
    const selectedValues = new Set(column?.getFilterValue() as (string | number | null)[])

    const getFacetCount = (value: string | number | null) => {
        if (value === null) {
            // Count items with null or undefined values
            return facets?.get(null) || facets?.get(undefined) || 0
        }
        return facets?.get(value) || facets?.get(value.toString()) || 0
    }

    // Add empty/null option if includeEmpty is true
    const allOptions = includeEmpty
        ? [{ label: 'Kosong', value: null }, ...options]
        : options

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant='outline' size='sm' className='h-8 border-dashed'>
                    <PlusCircledIcon className='w-4 h-4 mr-2' />
                    {title}
                    {selectedValues?.size > 0 && (
                        <>
                            <Separator orientation='vertical' className='h-4 mx-2' />
                            <Badge
                                variant='secondary'
                                className='px-1 font-normal rounded-sm lg:hidden'
                            >
                                {selectedValues.size}
                            </Badge>
                            <div className='hidden space-x-1 lg:flex'>
                                {selectedValues.size > 2 ? (
                                    <Badge
                                        variant='secondary'
                                        className='px-1 font-normal rounded-sm'
                                    >
                                        {selectedValues.size} selected
                                    </Badge>
                                ) : (
                                    options
                                        .filter((option) => selectedValues.has(option.value))
                                        .map((option) => (
                                            <Badge
                                                variant='secondary'
                                                key={option.value}
                                                className='px-1 font-normal rounded-sm'
                                            >
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0' align='start'>
                <Command>
                    <CommandInput placeholder={title} className="border-0 focus:outline-none focus:ring-0 focus:ring-offset-0" />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {allOptions.map((option) => {
                                const isSelected = selectedValues.has(option.value)
                                const facetCount = getFacetCount(option.value)
                                return (
                                    <CommandItem
                                        key={option.value?.toString() ?? 'null'}
                                        onSelect={() => {
                                            if (isSelected) {
                                                selectedValues.delete(option.value)
                                            } else {
                                                selectedValues.add(option.value)
                                            }
                                            const filterValues = Array.from(selectedValues)
                                            column?.setFilterValue(
                                                filterValues.length ? filterValues : undefined
                                            )
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                                isSelected
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'opacity-50 [&_svg]:invisible'
                                            )}
                                        >
                                            <CheckIcon className={cn('h-4 w-4')} />
                                        </div>
                                        {option.icon && (
                                            <option.icon className='w-4 h-4 mr-2 text-muted-foreground' />
                                        )}
                                        <span>{option.label}</span>
                                        {facetCount > 0 && (
                                            <span className='flex items-center justify-center w-4 h-4 ml-auto font-mono text-xs'>
                                                {facetCount}
                                            </span>
                                        )}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                        {selectedValues.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => column?.setFilterValue(undefined)}
                                        className='justify-center text-center'
                                    >
                                        Reset
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
