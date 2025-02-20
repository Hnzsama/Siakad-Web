import React, { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Search, ChevronRight } from 'lucide-react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FormData, School } from '../data/schema'
import { useResourceContext } from '../context/context'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: School
}

export function MutateDrawer({ open, onOpenChange, currentRow }: Props) {
    const isUpdate = !!currentRow
    const { resourceName, mainRoute } = useResourceContext()

    const { data, setData, post, put, errors, processing, reset } = useForm<FormData>({
        name: currentRow?.name ?? 'Luqman',
        npsn: currentRow?.npsn ?? '1673153',
        schoolLevel: currentRow?.schoolLevel ?? 'smk',
        address: currentRow?.address ?? 'Girilaya',
        province_code: currentRow?.province_code ?? 35,
        regency_code: currentRow?.regency_code ?? 3578,
        district_code: currentRow?.district_code ?? 357801,
        postal_code: currentRow?.postal_code ?? '60254',
        status: currentRow?.status ?? true,
    })

    const onSubmit = (e: React.FormEvent) => {
            e.preventDefault()
    
            const options = {
                onError: (errors: any) => {
                    console.error('Error:', errors);
                    reset()
                    toast({
                        variant: "destructive",
                        title: `Gagal menyimpan ${resourceName}`,
                        description: "Silakan periksa kembali form anda"
                    })
                },
                onSuccess: (response: any) => {
                    console.log('Success:', response);
                    onOpenChange(false)
                    reset()
                    toast({
                        title: isUpdate ? `${resourceName} berhasil diperbarui` : `${resourceName} berhasil disimpan`,
                        description: isUpdate
                            ? `${resourceName} telah berhasil diperbarui dalam sistem`
                            : `${resourceName} telah berhasil ditambahkan ke sistem`
                    })
                },
                preserveScroll: true
            }
    
            if (isUpdate && currentRow?.id) {
                put(route(`${mainRoute}.update`, { id: currentRow.id }), options)
            } else {
                post(route(`${mainRoute}.store`), options)
            }
        }

    return (
        <Sheet open={open} onOpenChange={(v) => {
            onOpenChange(v)
            if (!v) {
                reset()
            }
        }}>
            <SheetContent className="w-full sm:max-w-xl">
                <form id="roles-form" onSubmit={onSubmit} className="flex flex-col h-full">
                    <SheetHeader className="space-y-2 text-left">
                        <SheetTitle>{isUpdate ? 'Update' : 'Tambah'} {resourceName}</SheetTitle>
                        <SheetDescription>
                            {isUpdate
                                ? `Update ${resourceName.toLocaleLowerCase()} dengan mengisi informasi yang diperlukan.`
                                : `Tambah ${resourceName.toLocaleLowerCase()} baru dengan mengisi informasi yang diperlukan.`}
                        </SheetDescription>
                    </SheetHeader>

                    {/* <div className="flex flex-col mt-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Role</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={e => setData("name", e.target.value)}
                                placeholder="Masukkan nama role"
                                className={errors.name ? "ring-destructive" : ""}
                            />
                            {errors.name && (
                                <span className="text-sm text-destructive">{errors.name}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="guard_name">Guard Name</Label>
                            <Input
                                id="guard_name"
                                value={data.guard_name}
                                onChange={e => setData("guard_name", e.target.value)}
                                placeholder="Masukkan guard name"
                                className={errors.guard_name ? "ring-destructive" : ""}
                            />
                            {errors.guard_name && (
                                <span className="text-sm text-destructive">{errors.guard_name}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="select-all"
                                        checked={selectAll}
                                        onCheckedChange={handleToggleAllPermissions}
                                    />
                                    <Label htmlFor="select-all">Pilih Semua Izin</Label>
                                </div>
                                <div className="relative w-44">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari izin..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <ScrollArea className="flex-1 px-6 my-4 -mx-6">
                        <div className="space-y-2">
                            {Object.entries(filteredPermissions).map(([modelName, permissions]) => (
                                <Collapsible
                                    key={modelName}
                                    open={openSections[modelName]}
                                    onOpenChange={() => toggleSection(modelName)}
                                >
                                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg bg-muted">
                                        <div className="flex items-center gap-2">
                                            <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${openSections[modelName] ? "rotate-90" : ""}`} />
                                            <span className="text-sm font-medium">{modelName}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {permissions.length} izin
                                        </span>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="px-2 py-3">
                                        <div className="grid grid-cols-1 gap-2">
                                            {permissions.map((permission) => (
                                                <div key={permission} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={permission}
                                                        checked={data.permissions[permission] || false}
                                                        onCheckedChange={(checked) =>
                                                            handlePermissionChange(permission, checked)
                                                        }
                                                    />
                                                    <Label
                                                        htmlFor={permission}
                                                        className="text-sm cursor-pointer"
                                                    >
                                                        {formatPermissionName(permission)}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            ))}
                        </div>
                    </ScrollArea> */}

                    {/* <SheetFooter className="flex-shrink-0 gap-2">
                        <SheetClose asChild>
                            <Button variant="outline">Tutup</Button>
                        </SheetClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </SheetFooter> */}
                </form>
            </SheetContent>
        </Sheet>
    )
}
