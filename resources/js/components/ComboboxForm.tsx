import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

interface ComboboxFormProps {
    value?: string
    onValueChange: (value: string) => void
    label?: string
    placeholder?: string
    searchPlaceholder?: string
    emptyMessage?: string
    options: Array<{
        value: string
        label: string
    }>
    className?: string
    error?: boolean
    errorMessage?: string
    disabled?: boolean
    hidden?: boolean
    maxHeight?: string
}

export function ComboboxForm({
    value,
    onValueChange,
    label,
    placeholder = "Select option...",
    searchPlaceholder = "Search...",
    emptyMessage = "No option found.",
    options,
    className,
    error,
    errorMessage,
    disabled = false,
    hidden = false,
    maxHeight = "300px"
}: ComboboxFormProps) {
    const [open, setOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [filteredOptions, setFilteredOptions] = React.useState(options)
    const [isLoading, setIsLoading] = React.useState(false)

    const getFilteredOptions = React.useCallback((query: string) => {
        if (!query) return options
        const normalizedQuery = query.toLowerCase().trim()
        return options.filter((option) => {
            const normalizedLabel = option.label.toLowerCase()
            return normalizedLabel.includes(normalizedQuery) ||
                   normalizedLabel.startsWith(normalizedQuery) ||
                   normalizedLabel.split(' ').some(word => word.startsWith(normalizedQuery))
        })
    }, [options])

    React.useEffect(() => {
        if (!open) return

        setIsLoading(true)
        const timer = setTimeout(() => {
            setFilteredOptions(getFilteredOptions(searchQuery))
            setIsLoading(false)
        }, searchQuery ? 150 : 0)

        return () => clearTimeout(timer)
    }, [searchQuery, open, getFilteredOptions])

    return (
        <div className="space-y-2" hidden={hidden}>
            {label && <Label htmlFor={label}>{label}</Label>}
            <Popover open={open} onOpenChange={disabled ? () => {} : setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={label}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between",
                            error && "ring-2 ring-destructive",
                            className
                        )}
                        onClick={disabled ? (e) => e.preventDefault() : undefined}
                        disabled={disabled}
                    >
                        {value
                            ? options.find((option) => option.value === value)?.label
                            : placeholder}
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        ) : (
                            <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-full p-0">
                    <Command className="w-full" shouldFilter={false}>
                        <CommandInput
                            placeholder={searchPlaceholder}
                            className="border-0 h-9 focus:outline-none focus:ring-0 focus:ring-offset-0"
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                        />
                        <CommandList 
                            className={cn(
                                "overflow-y-auto",
                                "scrollbar scrollbar-w-2 scrollbar-track-transparent scrollbar-thumb-gray-200",
                                "hover:scrollbar-thumb-gray-300"
                            )}
                            style={{ maxHeight }}
                        >
                            <CommandEmpty>
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    </div>
                                ) : (
                                    emptyMessage
                                )}
                            </CommandEmpty>
                            <CommandGroup>
                                {filteredOptions.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        onSelect={(currentValue) => {
                                            const selectedOption = options.find(
                                                opt => opt.label.toLowerCase() === currentValue.toLowerCase()
                                            )
                                            if (selectedOption) {
                                                onValueChange(selectedOption.value === value ? "" : selectedOption.value)
                                            }
                                            setSearchQuery("")
                                            setOpen(false)
                                        }}
                                        className="cursor-pointer"
                                    >
                                        {option.label}
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value === option.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {error && errorMessage && (
                <span className="text-sm text-destructive">{errorMessage}</span>
            )}
        </div>
    )
}