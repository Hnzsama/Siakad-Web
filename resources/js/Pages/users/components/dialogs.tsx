import { Table } from '@tanstack/react-table'
import { useResourceContext } from '../context/context'
import { UsersActionDialog } from './action-dialog'
import { UsersDeleteDialog } from './delete-dialog'
import { UsersInviteDialog } from './invite-dialog'

interface DialogProps<TData> {
    table: Table<TData>
}

export function Dialogs<TData>({
    table
}: DialogProps<TData>) {
    const { open, setOpen, currentRow, setCurrentRow } = useResourceContext()
    return (
        <>
            <UsersActionDialog
                key='user-add'
                open={open === 'add'}
                onOpenChange={() => setOpen('add')}
            />

            <UsersInviteDialog
                key='user-invite'
                open={open === 'invite'}
                onOpenChange={() => setOpen('invite')}
            />

            {currentRow && (
                <>
                    <UsersActionDialog
                        key={`user-edit-${currentRow.id}`}
                        open={open === 'edit'}
                        onOpenChange={() => {
                            setOpen('edit')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
                    />

                    <UsersDeleteDialog
                        key={`user-delete-${currentRow.id}`}
                        open={open === 'delete'}
                        onOpenChange={() => {
                            setOpen('delete')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
                    />
                </>
            )}
        </>
    )
}
