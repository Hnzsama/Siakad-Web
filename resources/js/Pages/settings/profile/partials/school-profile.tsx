import { FormProfile, RegionalResponse, School } from "@/Pages/schools/data/schema"
import { toast } from '@/hooks/use-toast'
import { can } from "@/utils/permissions"
import { useForm, usePage } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PhoneInput from "@/components/PhoneInput"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ComboboxForm } from "@/components/ComboboxForm"
import React from "react"
import { cn } from "@/lib/utils"

export default function SchoolProfile({
    school
}: {
    school?: School
}) {
    const isEditable = can('update_school')
    const { provinces = [], regencies = [], districts = [] } = usePage<RegionalResponse>().props

    const { data, setData, put, errors, processing, reset } = useForm<FormProfile>('schoolProfileForm', {
        name: school?.name ?? '',
        npsn: school?.npsn ?? '',
        schoolLevel: school?.schoolLevel ?? '',
        address: school?.address ?? '',
        province_code: school?.province_code ?? 0,
        regency_code: school?.regency_code ?? 0,
        district_code: school?.district_code ?? 0,
        postal_code: school?.postal_code ?? '',
        phone: school?.phone ?? '',
        email: school?.email ?? '',
        website: school?.website ?? '',
        accreditation: school?.accreditation ?? '',
        accreditation_year: school?.accreditation_year ?? '',
        headmaster: school?.headmaster ?? '',
        teacher_count: school?.teacher_count ?? 0,
        student_count: school?.student_count ?? 0,
        ownership: school?.ownership ?? '',
        establishment_year: school?.establishment_year ?? '',
        curriculum: school?.curriculum ?? '',
        logo: school?.logo ?? '',
        status: school?.status ?? true,
    })

    const filteredRegencies = React.useMemo(() => {
        if (!regencies?.length || !data.province_code) return []
        return regencies.filter(
            regency => regency.province_code === data.province_code
        )
    }, [regencies, data.province_code])

    const filteredDistricts = React.useMemo(() => {
        if (!districts?.length || !data.regency_code) return []
        return districts.filter(
            district => district.regency_code === data.regency_code
        )
    }, [districts, data.regency_code])

    const getRegionPlaceholder = React.useMemo(() => {
        if (!data.province_code) return "Pilih provinsi terlebih dahulu"
        if (!data.regency_code) return `Pilih kabupaten/kota di ${provinces.find(p => p.code === data.province_code)?.name ?? ''}`
        if (!data.district_code) return `Pilih kecamatan di ${regencies.find(r => r.code === data.regency_code)?.name ?? ''}`
    }, [data.province_code, data.regency_code, data.district_code, provinces, regencies])

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!school) return // Add guard clause

        const options = {
            onError: (errors: any) => {
                console.error('Error:', errors);
                toast({
                    variant: "destructive",
                    title: `Gagal menyimpan perbaruan profil`,
                    description: "Silakan periksa kembali form anda"
                })
            },
            onSuccess: (response: any) => {
                console.log('Success:', response);
                toast({
                    title: `Profil berhasil diperbarui`,
                    description: `Profil telah berhasil diperbarui dalam sistem`
                })
            },
            preserveScroll: true
        }

        put(route(`profile.school.update`, { id: school.id }), options)
    }

    if (!school) {
        return <div>School data not available</div> // Add fallback UI
    }

    const renderInput = (id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string, type: string = "text") => {
        return (
            <Input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={!isEditable}
            />
        )
    }

    const renderSelect = (value: string, options: { value: string, label: string }[], placeholder: string) => {
        return (
            <SelectTrigger>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
        )
    }

    const renderCombobox = (
        label: string,
        value: string,
        options: { value: string, label: string }[],
        placeholder: string,
        searchPlaceholder: string,
        emptyMessage: string,
        isDisabled?: boolean
    ) => {
        return (
            <ComboboxForm
                label={label}
                value={value}
                options={options}
                placeholder={placeholder}
                searchPlaceholder={searchPlaceholder}
                emptyMessage={emptyMessage}
                disabled={isDisabled}
                onValueChange={(value) => setData('province_code', Number(value))}
            />
        )
    }

    return (
        <form onSubmit={onSubmit} className={cn(!isEditable && "pointer-events-none")}>
            <div className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium">Informasi Umum</h3>
                        <p className="text-sm text-muted-foreground">
                            Informasi dasar tentang sekolah.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Sekolah</Label>
                            {renderInput(
                                "name",
                                data.name,
                                (e) => setData('name', e.target.value),
                                "Masukkan nama sekolah"
                            )}
                            {errors.name && (
                                <span className="text-sm text-destructive">{errors.name}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="npsn">NPSN</Label>
                            {renderInput(
                                "npsn",
                                data.npsn,
                                (e) => setData('npsn', e.target.value),
                                "Masukkan NPSN"
                            )}
                            {errors.npsn && (
                                <span className="text-sm text-destructive">{errors.npsn}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="schoolLevel">Jenjang</Label>
                            <Select
                                value={data.schoolLevel}
                                onValueChange={(value) => setData('schoolLevel', value)}
                            >
                                {renderSelect(
                                    data.schoolLevel,
                                    [
                                        { value: "sd", label: "SD/MI" },
                                        { value: "smp", label: "SMP/MTs" },
                                        { value: "sma", label: "SMA/MA" },
                                        { value: "smk", label: "SMK" }
                                    ],
                                    "Pilih jenjang"
                                )}
                                <SelectContent>
                                    <SelectItem value="sd">SD/MI</SelectItem>
                                    <SelectItem value="smp">SMP/MTs</SelectItem>
                                    <SelectItem value="sma">SMA/MA</SelectItem>
                                    <SelectItem value="smk">SMK</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.schoolLevel && (
                                <span className="text-sm text-destructive">{errors.schoolLevel}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ownership">Status Kepemilikan</Label>
                            <Select
                                value={data.ownership ?? ''}
                                onValueChange={(value) => setData('ownership', value)}
                            >
                                {renderSelect(
                                    data.ownership ?? '',
                                    [
                                        { value: "negeri", label: "Negeri" },
                                        { value: "swasta", label: "Swasta" }
                                    ],
                                    "Pilih status kepemilikan"
                                )}
                                <SelectContent>
                                    <SelectItem value="negeri">Negeri</SelectItem>
                                    <SelectItem value="swasta">Swasta</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.ownership && (
                                <span className="text-sm text-destructive">{errors.ownership}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Location Information */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium">Informasi Lokasi</h3>
                        <p className="text-sm text-muted-foreground">
                            Detail alamat dan lokasi sekolah.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {renderCombobox(
                            'Provinsi',
                            data.province_code ? data.province_code.toString() : '',
                            provinces.map(province => ({
                                value: province.code.toString(),
                                label: province.name
                            })),
                            "Pilih Provinsi",
                            "Cari nama provinsi...",
                            "Provinsi tidak ditemukan.",
                            !!errors.province_code
                        )}

                        {renderCombobox(
                            'Kota',
                            data.regency_code ? data.regency_code.toString() : '',
                            filteredRegencies.map(regency => ({
                                value: regency.code.toString(),
                                label: regency.name
                            })),
                            !data.province_code ? "Pilih provinsi terlebih dahulu" : "Pilih Kabupaten/Kota",
                            "Cari nama kabupaten/kota...",
                            !data.province_code ? "Pilih provinsi terlebih dahulu" : "Kabupaten/Kota tidak ditemukan",
                            !!errors.regency_code
                        )}

                        {renderCombobox(
                            'Kecamatan',
                            data.district_code ? data.district_code.toString() : '',
                            filteredDistricts.map(district => ({
                                value: district.code.toString(),
                                label: district.name
                            })),
                            !data.regency_code ? "Pilih kabupaten/kota terlebih dahulu" : "Pilih Kecamatan",
                            "Cari nama kecamatan...",
                            !data.regency_code ? "Pilih kabupaten/kota terlebih dahulu" : "Kecamatan tidak ditemukan",
                            !!errors.district_code
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="postal_code">Kode Pos</Label>
                            {renderInput(
                                "postal_code",
                                data.postal_code,
                                (e) => setData('postal_code', e.target.value),
                                "Masukkan kode pos"
                            )}
                            {errors.postal_code && (
                                <span className="text-sm text-destructive">{errors.postal_code}</span>
                            )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Alamat Lengkap</Label>
                            {renderInput(
                                "address",
                                data.address,
                                (e) => setData('address', e.target.value),
                                "Masukkan alamat lengkap"
                            )}
                            {errors.address && (
                                <span className="text-sm text-destructive">{errors.address}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium">Informasi Kontak</h3>
                        <p className="text-sm text-muted-foreground">
                            Kontak resmi sekolah.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            {renderInput(
                                "email",
                                data.email ?? '',
                                (e) => setData('email', e.target.value),
                                "Masukkan email",
                                "email"
                            )}
                            {errors.email && (
                                <span className="text-sm text-destructive">{errors.email}</span>
                            )}
                        </div>

                        <PhoneInput
                            value={data.phone ?? ''}
                            onChange={(value) => setData('phone', value)}
                            label="Nomor Telepon"
                            placeholder="Masukkan nomor telepon"
                            error={errors.phone}
                            disabled={!isEditable}
                        />

                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            {renderInput(
                                "website",
                                data.website ?? '',
                                (e) => setData('website', e.target.value),
                                "Masukkan website",
                                "url"
                            )}
                            {errors.website && (
                                <span className="text-sm text-destructive">{errors.website}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium">Informasi Tambahan</h3>
                        <p className="text-sm text-muted-foreground">
                            Informasi tambahan tentang sekolah.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="headmaster">Kepala Sekolah</Label>
                            {renderInput(
                                "headmaster",
                                data.headmaster ?? '',
                                (e) => setData('headmaster', e.target.value),
                                "Masukkan nama kepala sekolah"
                            )}
                            {errors.headmaster && (
                                <span className="text-sm text-destructive">{errors.headmaster}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="curriculum">Kurikulum</Label>
                            {renderInput(
                                "curriculum",
                                data.curriculum ?? '',
                                (e) => setData('curriculum', e.target.value),
                                "Masukkan kurikulum"
                            )}
                            {errors.curriculum && (
                                <span className="text-sm text-destructive">{errors.curriculum}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="accreditation">Akreditasi</Label>
                            {renderInput(
                                "accreditation",
                                data.accreditation ?? '',
                                (e) => setData('accreditation', e.target.value),
                                "Masukkan akreditasi"
                            )}
                            {errors.accreditation && (
                                <span className="text-sm text-destructive">{errors.accreditation}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="establishment_year">Tahun Berdiri</Label>
                            {renderInput(
                                "establishment_year",
                                data.establishment_year ? String(data.establishment_year) : "",
                                (e) => setData("establishment_year", e.target.value),
                                "Masukkan tahun berdiri"
                            )}

                            {errors.establishment_year && (
                                <span className="text-sm text-destructive">{errors.establishment_year}</span>
                            )}
                        </div>
                    </div>
                </div>

                {isEditable && (
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                )}
            </div>
        </form>
    )
}
