import { toast } from '@/hooks/use-toast'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useRoles } from '../context/roles-context'
import { RolesImportDialog } from './roles-import-dialog'
import { RolesMutateDrawer } from './roles-mutate-drawer'
import { useForm } from '@inertiajs/react'
import { Role } from '../data/schema'
import { Table } from '@tanstack/react-table'

interface RolesDialogProps<TData> {
    table: Table<TData>
    modelPermissions: Record<string, string[]>
}

export function RolesDialogs<TData>({
    table,
    modelPermissions
}: RolesDialogProps<TData>) {
    const { open, setOpen, currentRow, setCurrentRow, resourceName } = useRoles()
    const { delete: destroy, post, processing } = useForm()

    const handleDelete = () => {
        if (!currentRow) return

        const resetSelection = () => {
            if (table) {
                table.resetRowSelection();
            }
        };

        if (currentRow.selectedIds) {
            post(route('roles.bulkDestroy', { ids: currentRow.selectedIds }), {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        title: `${resourceName.toLocaleLowerCase()} berhasil dihapus`,
                        description: `${currentRow.selectedIds?.length} ${resourceName.toLocaleLowerCase()} telah dihapus dari sistem`,
                    })
                    resetSelection();
                    setOpen(null)
                    setTimeout(() => {
                        setCurrentRow(null)
                    }, 500)
                },
                onError: (errors: any) => {
                    toast({
                        variant: "destructive",
                        title: `Gagal menghapus ${resourceName.toLocaleLowerCase()}`,
                        description: errors.error || `Terjadi kesalahan saat menghapus ${resourceName.toLocaleLowerCase()}`,
                    })
                },
            })
        } else {
            destroy(route('roles.destroy', { id: currentRow.id }), {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        title: `${resourceName.toLocaleLowerCase()} berhasil dihapus`,
                        description: `${currentRow.selectedIds?.length} ${resourceName.toLocaleLowerCase()} telah dihapus dari sistem`,
                    })
                    resetSelection();
                    setOpen(null)
                    setTimeout(() => {
                        setCurrentRow(null)
                    }, 500)
                },
                onError: (errors: any) => {
                    toast({
                        variant: "destructive",
                        title: `Gagal menghapus ${resourceName.toLocaleLowerCase()}`,
                        description: errors.error || `Terjadi kesalahan saat menghapus ${resourceName.toLocaleLowerCase()}`,
                    })
                },
            })
        }
    }

    return (
        <>
            <RolesMutateDrawer
                key={`${resourceName.toLocaleLowerCase()}-create`}
                open={open === 'create'}
                onOpenChange={() => setOpen('create')}
                modelPermissions={modelPermissions}
            />

            <RolesImportDialog
                key={`${resourceName.toLocaleLowerCase()}-import`}
                open={open === 'import'}
                onOpenChange={() => setOpen('import')}
            />

            {currentRow && (
                <>
                    <RolesMutateDrawer
                        key={`${resourceName.toLocaleLowerCase()}-update-${currentRow.id}`}
                        open={open === 'update'}
                        onOpenChange={() => {
                            setOpen('update')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
                        modelPermissions={modelPermissions}
                    />

                    <ConfirmDialog
                        key={`${resourceName.toLocaleLowerCase()}-delete`}
                        destructive
                        open={open === 'delete'}
                        onOpenChange={() => {
                            setOpen('delete')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        handleConfirm={handleDelete}
                        className='max-w-md'
                        title={
                            currentRow.selectedIds
                                ? `Hapus ${currentRow.selectedIds.length} ${resourceName.toLocaleLowerCase()}?`
                                : `Hapus ${resourceName.toLocaleLowerCase()}: ${currentRow.name}?`
                        }
                        desc={
                            currentRow.selectedIds
                                ? `Tindakan ini akan menghapus beberapa ${resourceName.toLocaleLowerCase()} yang dipilih secara permanen.`
                                : `Tindakan ini akan menghapus ${resourceName.toLocaleLowerCase()} yang dipilih secara permanen.`
                        }
                        confirmText='Hapus'
                    />
                </>
            )}
        </>
    )
}
