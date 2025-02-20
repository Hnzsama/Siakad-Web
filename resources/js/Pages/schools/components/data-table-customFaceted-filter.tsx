import React from 'react';
import { Column } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LocationOption {
    label: string;
    value: number;
}

interface RegencyOption extends LocationOption {
    province_code: number;
}

interface DistrictOption extends LocationOption {
    regency_code: number;
}

interface DataTableCustomFacetedFilterProps<TData, TValue> {
    column?: Column<TData, TValue>;
    title: string;
    options: LocationOption[] | RegencyOption[] | DistrictOption[];
    selectedProvinces?: number[];
    selectedRegencies?: number[];
    disabled?: boolean;
    onSelect?: (values: number[]) => void;
}

export function DataTableCustomFacetedFilter<TData, TValue>({
    column,
    title,
    options,
    selectedProvinces = [],
    selectedRegencies = [],
    disabled = false,
    onSelect
}: DataTableCustomFacetedFilterProps<TData, TValue>) {
    const facets = column?.getFacetedUniqueValues();
    const selectedValues = new Set(column?.getFilterValue() as number[]);
    const [isOpen, setIsOpen] = React.useState(false);

    // Calculate if the filter should be disabled based on parent selections
    const isDisabled = React.useMemo(() => {
        if (disabled) return true;
        if (title === 'Kabupaten/Kota') return selectedProvinces.length === 0;
        if (title === 'Kecamatan') return selectedRegencies.length === 0;
        return false;
    }, [disabled, title, selectedProvinces.length, selectedRegencies.length]);

    // Filter options based on selected provinces/regencies
    const filteredOptions = React.useMemo(() => {
        if (title === 'Kabupaten/Kota' && selectedProvinces.length > 0) {
            return (options as RegencyOption[]).filter(
                option => selectedProvinces.includes(option.province_code)
            );
        }
        if (title === 'Kecamatan' && selectedRegencies.length > 0) {
            return (options as DistrictOption[]).filter(
                option => selectedRegencies.includes(option.regency_code)
            );
        }
        return options;
    }, [options, selectedProvinces, selectedRegencies, title]);

    const getPlaceholderText = () => {
        if (isDisabled) {
            if (title === 'Kabupaten/Kota') return 'Pilih Provinsi terlebih dahulu';
            if (title === 'Kecamatan') return 'Pilih Kabupaten/Kota terlebih dahulu';
        }
        return `Cari ${title}...`;
    };

    const handleSelect = (optionValue: number) => {
        const newSelectedValues = new Set(selectedValues);

        if (newSelectedValues.has(optionValue)) {
            newSelectedValues.delete(optionValue);
        } else {
            newSelectedValues.add(optionValue);
        }

        const filterValues = Array.from(newSelectedValues);
        column?.setFilterValue(filterValues.length ? filterValues : undefined);

        if (onSelect) {
            onSelect(filterValues);
        }
    };

    // Clear selection when parent filter is cleared or component becomes disabled
    React.useEffect(() => {
        if (isDisabled && selectedValues.size > 0) {
            column?.setFilterValue(undefined);
            if (onSelect) {
                onSelect([]);
            }
        }
    }, [isDisabled, selectedValues.size, column, onSelect]);

    // Close popover when component becomes disabled
    React.useEffect(() => {
        if (isDisabled) {
            setIsOpen(false);
        }
    }, [isDisabled]);

    return (
        <Popover open={!isDisabled && isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "h-8 border-dashed",
                        isDisabled && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={isDisabled}
                >
                    <PlusCircledIcon className="w-4 h-4 mr-2" />
                    {title}
                    {selectedValues?.size > 0 && (
                        <>
                            <Separator orientation="vertical" className="h-4 mx-2" />
                            <Badge variant="secondary" className="px-1 font-normal rounded-sm lg:hidden">
                                {selectedValues.size}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {selectedValues.size > 2 ? (
                                    <Badge variant="secondary" className="px-1 font-normal rounded-sm">
                                        {selectedValues.size} selected
                                    </Badge>
                                ) : (
                                    filteredOptions
                                        .filter((option) => selectedValues.has(option.value))
                                        .map((option) => (
                                            <Badge
                                                variant="secondary"
                                                key={option.value}
                                                className="px-1 font-normal rounded-sm"
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
            <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                    <CommandInput
                        placeholder={getPlaceholderText()}
                        className="border-0 focus:outline-none focus:ring-0 focus:ring-offset-0"
                    />
                    <CommandList>
                        <ScrollArea>
                            <CommandEmpty>Tidak ada hasil.</CommandEmpty>
                            <CommandGroup>
                                {filteredOptions.map((option) => {
                                    const isSelected = selectedValues.has(option.value);
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            onSelect={() => handleSelect(option.value)}
                                        >
                                            <div
                                                className={cn(
                                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                    isSelected
                                                        ? "bg-primary text-primary-foreground"
                                                        : "opacity-50 [&_svg]:invisible"
                                                )}
                                            >
                                                <CheckIcon className={cn("h-4 w-4")} />
                                            </div>
                                            <span>{option.label}</span>
                                            {facets?.get(option.value) && (
                                                <span className="flex items-center justify-center w-4 h-4 ml-auto font-mono text-xs">
                                                    {facets.get(option.value)}
                                                </span>
                                            )}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </ScrollArea>
                        {selectedValues.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => {
                                            column?.setFilterValue(undefined);
                                            if (onSelect) onSelect([]);
                                            setIsOpen(false);
                                        }}
                                        className="justify-center text-center"
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
    );
}
