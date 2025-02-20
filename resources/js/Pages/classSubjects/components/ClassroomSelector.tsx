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
import { router } from "@inertiajs/react"

interface Classroom {
    id: string
    name: string
}

interface ClassroomSelectorProps {
    classrooms?: Classroom[] | null
    currentClassroomId?: string | null
    className?: string
}

export function ClassroomSelector({ classrooms = [], currentClassroomId, className }: ClassroomSelectorProps) {
    const [open, setOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [filteredClassrooms, setFilteredClassrooms] = React.useState<Classroom[]>([])

    const safeClassrooms = React.useMemo(() =>
        classrooms?.filter((c): c is Classroom =>
            c !== null && typeof c === 'object' && 'id' in c && 'name' in c
        ) ?? [],
        [classrooms]
    );

    const currentClassroom = React.useMemo(() =>
        safeClassrooms.find(c => c.id === currentClassroomId),
        [safeClassrooms, currentClassroomId]
    );

    // Initialize filtered classrooms
    React.useEffect(() => {
        setFilteredClassrooms(safeClassrooms);
    }, [safeClassrooms]);

    // Memoize filtered results function
    const getFilteredClassrooms = React.useCallback((query: string) => {
        if (!query) return safeClassrooms;
        const normalizedQuery = query.toLowerCase().trim();
        return safeClassrooms.filter((classroom) => {
            const normalizedName = classroom.name.toLowerCase();
            return normalizedName.includes(normalizedQuery) ||
                   normalizedName.startsWith(normalizedQuery) ||
                   normalizedName.split(' ').some(word => word.startsWith(normalizedQuery));
        });
    }, [safeClassrooms]);

    // Handle search with debounce
    React.useEffect(() => {
        if (!open) return;

        const timer = setTimeout(() => {
            const results = getFilteredClassrooms(searchQuery);
            setFilteredClassrooms(results);
            setIsLoading(false);
        }, 150);

        return () => clearTimeout(timer);
    }, [searchQuery, open, getFilteredClassrooms]);

    // Reset states when popover closes
    React.useEffect(() => {
        if (!open) {
            setSearchQuery("");
            setIsLoading(false);
            setFilteredClassrooms(safeClassrooms);
        }
    }, [open, safeClassrooms]);

    const handleSelect = React.useCallback((classroomId: string) => {
        setIsLoading(true);
        if (route().current('classSubjects.edit')) {
            router.visit(route('classSubjects.edit', classroomId));
        } else {
            router.visit(route('classSubjects.show', classroomId));
        }
        setSearchQuery("");
        setOpen(false);
    }, []);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-[150px] justify-between", className)}
                >
                    {currentClassroom?.name ?? "Pilih Kelas..."}
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    ) : (
                        <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                    )}
                </Button>
            </PopoverTrigger>
            {safeClassrooms.length > 0 && (
                <PopoverContent className="w-[150px] p-0">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Cari kelas..."
                            className="border-0 h-9 focus:outline-none focus:ring-0 focus:ring-offset-0"
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                        />
                        <CommandList>
                            <CommandEmpty>
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    </div>
                                ) : (
                                    "Kelas tidak ditemukan."
                                )}
                            </CommandEmpty>
                            <CommandGroup>
                                {filteredClassrooms.map((classroom) => (
                                    <CommandItem
                                        key={classroom.id}
                                        value={classroom.name}
                                        onSelect={() => handleSelect(classroom.id)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                currentClassroomId === classroom.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {classroom.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            )}
        </Popover>
    )
}
