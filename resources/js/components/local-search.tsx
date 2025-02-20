import { Input } from "./ui/input"
import { IconSearch } from '@tabler/icons-react'

interface LocalSearchProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

export function LocalSearch({ value, onChange, placeholder = "Search..." }: LocalSearchProps) {
    return (
        <div className="relative">
            <IconSearch className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
            <Input
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="pl-9 w-[200px] lg:w-[300px]"
            />
        </div>
    )
}
