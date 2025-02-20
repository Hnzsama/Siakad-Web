import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";
import { AttendanceSetting, FormData } from "./schema";
import { useToast } from "@/hooks/use-toast";

export function AttendanceSettingForm({
    attendanceSetting
}: {
    attendanceSetting: AttendanceSetting
}) {
    const { toast } = useToast()

    const { data, setData, post, processing, reset, put } = useForm<FormData>({
        allow_location_based: attendanceSetting.allow_location_based ?? false,
        allowed_radius: attendanceSetting.allowed_radius ?? 100,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const options = {
            onError: (errors: any) => {
                console.error('Error:', errors);
                reset()
                toast({
                    variant: "destructive",
                    title: `Gagal menyimpan Pengaturan`,
                    description: "Silakan periksa kembali form anda"
                })
            },
            onSuccess: (response: any) => {
                console.log('Success:', response);
                toast({
                    title: `Pengaturan berhasil diperbarui`,
                    description: `Pengaturan telah berhasil diperbarui dalam sistem`
                })
            },
            preserveScroll: true
        }

        put(route(`attendanceSetting.update`, { id: attendanceSetting.id }), options)
    }

    return (
        <div className="space-y-6 px-0.5">
            <form onSubmit={onSubmit} className="space-y-6">

                <div className="flex flex-row items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                        <Label className="text-base">
                            Absensi Berbasis Lokasi
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Aktifkan verifikasi lokasi saat absensi
                        </p>
                    </div>
                    <Switch
                        checked={data.allow_location_based}
                        onCheckedChange={(checked) =>
                            setData('allow_location_based', checked)
                        }
                    />
                </div>

                <div className="space-y-2" hidden={!data.allow_location_based}>
                    <Label>Radius yang Diizinkan (meter)</Label>
                    <Input
                        type="number"
                        value={data.allowed_radius ?? ""}
                        onChange={(e) =>
                            setData('allowed_radius', Number(e.target.value))
                        }
                        min={0}
                    />
                    <p className="text-sm text-muted-foreground">
                        Jarak maksimal dari lokasi yang ditentukan
                    </p>
                </div>

                <Button type="submit" disabled={processing}>
                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
            </form>
        </div>
    );
}
