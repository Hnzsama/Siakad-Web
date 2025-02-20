import React, { useState } from 'react'
import { router, useForm } from '@inertiajs/react'
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
import { Search } from 'lucide-react'
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Role, RoleFormData } from '../data/schema'
import { useRoles } from '../context/roles-context'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: Role
    modelPermissions: Record<string, string[]>
}

export function RolesMutateDrawer({ open, onOpenChange, currentRow, modelPermissions }: Props) {
    const isUpdate = !!currentRow
    const numberOfModels = Object.keys(modelPermissions).length
    const numberOfPermissions = numberOfModels * Object.values(modelPermissions)[0].length
    const [search, setSearch] = useState("")
    const { resourceName } = useRoles()

    const { data, setData, post, put, errors, processing, reset } = useForm<RoleFormData>({
        name: currentRow?.name ?? '',
        guard_name: currentRow?.guard_name ?? 'web',
        permissions: currentRow?.permissions ?? {},
    })

    const [selectAll, setSelectAll] = useState(numberOfPermissions === Object.keys(data.permissions).length ? true : false)

    const checkAllPermissionsSelected = (permissions: Record<string, boolean>) => {
        const allPermissions = Object.values(modelPermissions).flat()
        return allPermissions.every(permission => permissions[permission] === true)
    }

    const formatPermissionName = (permission: string) => {
        return permission.split('_').slice(0, -1).join(' ')
    }

    const handlePermissionChange = (permission: string, checked: boolean | "indeterminate") => {
        const newPermissions = {
            ...data.permissions,
            [permission]: checked === true,
        }
        setData("permissions", newPermissions)
        setSelectAll(checkAllPermissionsSelected(newPermissions))
    }

    const handleToggleAllPermissions = (checked: boolean) => {
        setSelectAll(checked)
        const newPermissions = { ...data.permissions }
        Object.values(modelPermissions).flat().forEach(permission => {
            newPermissions[permission] = checked
        })
        setData("permissions", newPermissions)
    }

    const handleToggleResourcePermissions = (modelName: string, checked: boolean) => {
        const newPermissions = { ...data.permissions }
        modelPermissions[modelName].forEach(permission => {
            newPermissions[permission] = checked
        })
        setData("permissions", newPermissions)
        setSelectAll(checkAllPermissionsSelected(newPermissions))
    }

    const filteredPermissions = Object.entries(modelPermissions).reduce((acc, [key, permissions]) => {
        const filtered = permissions.filter(p =>
            p.toLowerCase().includes(search.toLowerCase()) ||
            key.toLowerCase().includes(search.toLowerCase())
        )
        if (filtered.length > 0) acc[key] = filtered
        return acc
    }, {} as Record<string, string[]>)

    function resetAll() {
        reset()
        setSelectAll(false)
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const options = {
            onError: (errors: any) => {
                resetAll()
                toast({
                    variant: "destructive",
                    title: "Gagal menyimpan role",
                    description: "Silakan periksa kembali form anda"
                })
            },
            onSuccess: () => {
                onOpenChange(false)
                resetAll()
                toast({
                    title: isUpdate ? "Role berhasil diperbarui" : "Role berhasil disimpan",
                    description: isUpdate
                        ? "Role telah berhasil diperbarui dalam sistem"
                        : "Role telah berhasil ditambahkan ke sistem"
                })
                router.visit(route('roles.index'))
            },
            preserveScroll: true
        }

        if (isUpdate && currentRow?.id) {
            put(route('roles.update', { id: currentRow.id }), options)
        } else {
            post(route('roles.store'), options)
        }
    }

    const areAllResourcePermissionsSelected = (permissions: string[]) => {
        return permissions.every(permission => data.permissions[permission])
    }

    return (
        <Sheet open={open} onOpenChange={(v) => {
            onOpenChange(v)
            if (!v) {
                resetAll()
            }
        }}>
            <SheetContent className="w-full sm:max-w-3xl">
                <form id="roles-form" onSubmit={onSubmit} className="flex flex-col h-full">
                    <SheetHeader className="space-y-2 text-left">
                        <SheetTitle>{isUpdate ? 'Update' : 'Tambah'} {resourceName}</SheetTitle>
                        <SheetDescription>
                            {isUpdate
                                ? `Update ${resourceName.toLocaleLowerCase()} dengan mengisi informasi yang diperlukan.`
                                : `Tambah ${resourceName.toLocaleLowerCase()} baru dengan mengisi informasi yang diperlukan.`}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex flex-col mt-4 space-y-4">
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
                        <div className="grid gap-4">
                            {Object.entries(filteredPermissions).map(([modelName, permissions]) => (
                                <Card key={modelName}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">{modelName}</CardTitle>
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id={`select-all-${modelName}`}
                                                    checked={areAllResourcePermissionsSelected(permissions)}
                                                    onCheckedChange={(checked) => handleToggleResourcePermissions(modelName, checked)}
                                                />
                                                <Label htmlFor={`select-all-${modelName}`} className="text-sm">Pilih Semua</Label>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
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
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>

                    <SheetFooter className="flex-shrink-0 gap-2">
                        <SheetClose asChild>
                            <Button variant="outline">Tutup</Button>
                        </SheetClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
