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
import { Student } from "@/Pages/students/data/schema"
import { Label } from "@/components/ui/label"

interface StudentSelectorProps {
    students: Student[]
    currentStudentId?: string
    className?: string
    onChange: (studentId: string) => void
    label?: string
}

export default function StudentSelector({ students, currentStudentId, className, onChange, label }: StudentSelectorProps) {
    const [open, setOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [filteredStudents, setFilteredStudents] = React.useState<Student[]>(students)

    const currentStudent = React.useMemo(() =>
        students.find(s => s.id === currentStudentId),
        [students, currentStudentId]
    )

    // Initialize filtered students
    React.useEffect(() => {
        setFilteredStudents(students)
    }, [students])

    // Filter function
    const getFilteredStudents = React.useCallback((query: string) => {
        if (!query) return students
        const normalizedQuery = query.toLowerCase().trim()
        return students.filter((student) => {
            const normalizedName = student.name.toLowerCase()
            return normalizedName.includes(normalizedQuery) ||
                normalizedName.startsWith(normalizedQuery) ||
                student.nis.includes(normalizedQuery)
        })
    }, [students])

    // Handle search with debounce
    React.useEffect(() => {
        if (!open) return

        const timer = setTimeout(() => {
            const results = getFilteredStudents(searchQuery)
            setFilteredStudents(results)
            setIsLoading(false)
        }, 150)

        return () => clearTimeout(timer)
    }, [searchQuery, open, getFilteredStudents])

    // Reset states when popover closes
    React.useEffect(() => {
        if (!open) {
            setSearchQuery("")
            setIsLoading(false)
            setFilteredStudents(students)
        }
    }, [open, students])

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                </Label>
            )}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn("w-[280px] justify-between", className)}
                    >
                        <span className="flex-1 text-left truncate">
                            {currentStudent?.name ?? "Pilih Siswa..."}
                        </span>
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 ml-2 animate-spin shrink-0" />
                        ) : (
                            <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Cari siswa..."
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
                                    "Siswa tidak ditemukan."
                                )}
                            </CommandEmpty>
                            <CommandGroup>
                                {filteredStudents.map((student) => (
                                    <CommandItem
                                        key={student.id}
                                        value={student.name}
                                        onSelect={() => {
                                            onChange(student.id)
                                            setOpen(false)
                                        }}
                                        className="flex items-center"
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4 shrink-0",
                                                currentStudentId === student.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <span className="truncate">{student.name}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
