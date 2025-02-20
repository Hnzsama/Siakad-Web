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
import { useRoles } from '../context/roles-context'
import { roleSchema } from '../data/schema'

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const rowData = {
        ...row.original,
        permission_count: (row.original as any).permission_count ?? 0,
        checkedPermissions: (row.original as any).checkedPermissions ?? {}
    }

    const role = roleSchema.parse(rowData)

    const { setOpen, setCurrentRow, permissions } = useRoles()

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
                        setCurrentRow(role)
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
                        setCurrentRow(role)
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
