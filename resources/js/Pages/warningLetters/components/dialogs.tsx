import { toast } from '@/hooks/use-toast'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useResourceContext } from '../context/context'
import { ImportDialog } from './import-dialog'
import { MutateDrawer } from './mutate-drawer'
import { useForm } from '@inertiajs/react'
import { Table } from '@tanstack/react-table'

interface DialogProps<TData> {
    table: Table<TData>
}

export function Dialogs<TData>({
    table,
}: DialogProps<TData>) {
    const { open, setOpen, currentRow, setCurrentRow, resourceName, mainRoute } = useResourceContext()
    const { delete: destroy, post, processing } = useForm()

    const handleDelete = () => {
        if (!currentRow) return

        const resetSelection = () => {
            if (table) {
                table.resetRowSelection();
            }
        };

        if (currentRow.selectedIds) {
            post(route(`${mainRoute}.bulkDestroy`, { ids: currentRow.selectedIds }), {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        title: `${resourceName} berhasil dihapus`,
                        description: `${currentRow.selectedIds?.length} ${resourceName.toLocaleLowerCase()} telah dihapus dari sistem`,
                    })
                    resetSelection();
                    setOpen(null)
                    setTimeout(() => {
                        setCurrentRow(null)
                    }, 500)
                },
                onError: (errors: any) => {
                    console.error('Error:', errors);
                    toast({
                        variant: "destructive",
                        title: `Gagal menghapus ${resourceName.toLocaleLowerCase()}`,
                        description: errors.error || `Terjadi kesalahan saat menghapus ${resourceName.toLocaleLowerCase()}`,
                    })
                },
            })
        } else {
            destroy(route(`${mainRoute}.destroy`, { id: currentRow.id }), {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        title: `${resourceName} berhasil dihapus`,
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
            <MutateDrawer
                key={`${resourceName.toLocaleLowerCase()}-create`}
                open={open === 'create'}
                onOpenChange={() => setOpen('create')}
            />

            <ImportDialog
                key={`${resourceName.toLocaleLowerCase()}-import`}
                open={open === 'import'}
                onOpenChange={() => setOpen('import')}
            />

            {currentRow && (
                <>
                    <MutateDrawer
                        key={`${resourceName.toLocaleLowerCase()}-update-${currentRow.id}`}
                        open={open === 'update'}
                        onOpenChange={() => {
                            setOpen('update')
                            setTimeout(() => {
                                setCurrentRow(null)
                            }, 500)
                        }}
                        currentRow={currentRow}
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
                                : `Hapus ${resourceName.toLocaleLowerCase()}: ${currentRow.letter_number}?`
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
