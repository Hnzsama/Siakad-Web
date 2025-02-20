import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ViolationType } from "@/Pages/violationTypes/data/schema"
import { useState } from "react"

interface ViolationTypeSelectorProps {
    violationTypes: ViolationType[];
    currentViolationTypeId: string;
    onChange: (value: string) => void;
}

export default function ViolationTypeSelector({
    violationTypes,
    currentViolationTypeId,
    onChange
}: ViolationTypeSelectorProps) {
    const [open, setOpen] = useState(false)
    const currentViolationType = violationTypes.find(
        (type) => type.id === currentViolationTypeId
    )

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between w-48"
                >
                    {currentViolationTypeId
                        ? currentViolationType?.name
                        : "Pilih Jenis"}
                    <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0" align="start">
                <Command className="max-h-[300px]">
                    <CommandInput
                        placeholder="Cari jenis..."
                        className="sticky top-0 border-0 focus:outline-none focus:ring-0 focus:ring-offset-0 bg-background"
                    />
                    <CommandEmpty className="py-2 text-sm text-center">
                        Jenis tidak ditemukan.
                    </CommandEmpty>
                    <CommandGroup className="overflow-y-auto max-h-[200px]">
                        {violationTypes.map((type) => (
                            <CommandItem
                                key={type.id}
                                value={type.name}
                                onSelect={() => {
                                    onChange(type.id === currentViolationTypeId ? "" : type.id)
                                    setOpen(false)
                                }}
                                className="cursor-pointer"
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        currentViolationTypeId === type.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                {type.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}