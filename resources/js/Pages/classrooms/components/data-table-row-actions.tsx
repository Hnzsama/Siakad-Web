import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconTrash } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useResourceContext } from '../context/context'
import { classroomSchema } from '../data/schema'
import { router } from '@inertiajs/react'

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const data = classroomSchema.parse(row.original)
    const { setOpen, setCurrentRow, permissions, mainRoute } = useResourceContext()

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='ghost'
                    className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
                >
                    <DotsHorizontalIcon className='w-4 h-4' />
                    <span className='sr-only'>Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[160px]'>
                <DropdownMenuItem
                    onClick={() => {
                        router.get(route(`${mainRoute}.show`, { id: data.id }))
                    }}
                    hidden={!permissions.view}
                >
                    Detail
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        setCurrentRow(data)
                        setOpen('update')
                    }}
                    hidden={!permissions.update}
                >
                    Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator hidden={!permissions.delete} />
                <DropdownMenuSeparator hidden={!permissions.delete} />
                <DropdownMenuItem
                    onClick={() => {
                        setCurrentRow(data)
                        setOpen('delete')
                    }}
                    hidden={!permissions.delete}
                >
                    Delete
                    <DropdownMenuShortcut>
                        <IconTrash size={16} />
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
