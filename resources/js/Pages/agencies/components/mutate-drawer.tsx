import React from 'react'
import { useForm, usePage } from '@inertiajs/react'
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
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Agency, FormData, SelectResponse } from '../data/schema'
import { useResourceContext } from '../context/context'
import { ComboboxForm } from '@/components/ComboboxForm'
import { MapSelector } from './map-selector'
import 'leaflet/dist/leaflet.css'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: Agency
}

const MODEL_TYPES = {
    STUDENT: 'App\\Models\\Student',
    TEACHER: 'App\\Models\\Teacher'
} as const;

export function MutateDrawer({ open, onOpenChange, currentRow }: Props) {
    const isUpdate = !!currentRow
    const { resourceName, mainRoute } = useResourceContext()
    const { students, teachers } = usePage<SelectResponse>().props

    const { data, setData, post, put, errors, processing, reset } = useForm<FormData>({
        name: currentRow?.name ?? "",
        address: currentRow?.address ?? "",
        longitude: currentRow?.longitude ?? "",
        latitude: currentRow?.latitude ?? "",
        agencyable_type: currentRow?.agencyable_type ?? MODEL_TYPES.STUDENT,
        agencyable_id: currentRow?.agencyable_id ?? "",
        status: currentRow?.status ?? true,
    });

    // Get the appropriate list based on selected type
    const currentList = data.agencyable_type === MODEL_TYPES.STUDENT ? students : teachers;

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const options = {
            onError: (errors: any) => {
                console.error('Error:', errors);
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
            <SheetContent className="flex flex-col w-full h-full p-0 sm:max-w-xl">
                <form id="agency-form" onSubmit={onSubmit} className="flex flex-col h-full">
                    <div className="p-6">
                        <SheetHeader className="space-y-2 text-left">
                            <SheetTitle>{isUpdate ? 'Update' : 'Tambah'} {resourceName}</SheetTitle>
                            <SheetDescription>
                                {isUpdate
                                    ? `Update ${resourceName.toLocaleLowerCase()} dengan mengisi informasi yang diperlukan.`
                                    : `Tambah ${resourceName.toLocaleLowerCase()} baru dengan mengisi informasi yang diperlukan.`}
                            </SheetDescription>
                        </SheetHeader>
                    </div>

                    <div className="flex-1 px-6 overflow-y-auto">
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">Informasi Wajib</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        placeholder="Masukkan nama"
                                        className={errors.name ? "ring-destructive" : ""}
                                    />
                                    {errors.name && <span className="text-sm text-destructive">{errors.name}</span>}
                                </div>

                                {/* Agency Type */}
                                <div className="space-y-2">
                                    <Label htmlFor="agencyable_type">Tipe Agensi</Label>
                                    <Select
                                        value={data.agencyable_type}
                                        onValueChange={(value) => {
                                            setData("agencyable_type", value);
                                            setData("agencyable_id", ""); // Reset the ID when type changes
                                        }}
                                    >
                                        <SelectTrigger className={errors.agencyable_type ? "ring-destructive" : ""}>
                                            <SelectValue placeholder="Pilih tipe agensi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={MODEL_TYPES.STUDENT}>Siswa</SelectItem>
                                            <SelectItem value={MODEL_TYPES.TEACHER}>Guru</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.agencyable_type && <span className="text-sm text-destructive">{errors.agencyable_type}</span>}
                                </div>

                                {/* Agency ID */}
                                <ComboboxForm
                                    label={data.agencyable_type === MODEL_TYPES.STUDENT ? 'Siswa' : 'Guru'}
                                    value={data.agencyable_id ?? ""}
                                    onValueChange={(value) => setData("agencyable_id", value)}
                                    options={currentList.map(item => ({
                                        value: item.id,
                                        label: item.name
                                    }))}
                                    placeholder={`Pilih ${data.agencyable_type === MODEL_TYPES.STUDENT ? 'Siswa' : 'Guru'}`}
                                    searchPlaceholder={`Cari ${data.agencyable_type === MODEL_TYPES.STUDENT ? 'Siswa' : 'Guru'}...`}
                                    emptyMessage={`${data.agencyable_type === MODEL_TYPES.STUDENT ? 'Siswa' : 'Guru'} tidak ditemukan.`}
                                    error={!!errors.agencyable_id}
                                    errorMessage={errors.agencyable_id}
                                />

                                {/* Address */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="address">Alamat</Label>
                                    <Input
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData("address", e.target.value)}
                                        placeholder="Masukkan alamat"
                                        className={errors.address ? "ring-destructive" : ""}
                                    />
                                    {errors.address && <span className="text-sm text-destructive">{errors.address}</span>}
                                </div>

                                {/* Location Selector */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Lokasi</Label>
                                    <div className="h-[400px] border rounded-md">
                                        <MapSelector
                                            longitude={data.longitude}
                                            latitude={data.latitude}
                                            onPositionChange={(lng, lat, address) => {
                                                setData(data => ({
                                                    ...data,
                                                    longitude: lng,
                                                    latitude: lat,
                                                    address: address || data.address // Update address if provided
                                                }))
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Switch */}
                        <div className="flex items-center my-6 space-x-2">
                            <Switch
                                id="status"
                                checked={data.status}
                                onCheckedChange={(checked) => setData("status", checked)}
                            />
                            <Label htmlFor="status">Aktif</Label>
                        </div>
                    </div>

                    <div className="p-6">
                        <SheetFooter className="flex-shrink-0 gap-2">
                            <SheetClose asChild>
                                <Button variant="outline">Tutup</Button>
                            </SheetClose>
                            <Button type="submit" disabled={processing}>
                                {processing ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </SheetFooter>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    )
}
