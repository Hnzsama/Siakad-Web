import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Agency } from '../data/schema';
import { Building2, MapPin, User, MapIcon } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface AgencyDetailProps {
    agency: Agency;
}

// Type guards
function isStudent(agencyable: Agency['agencyable']): agencyable is { id: string; name: string; nis: string; } {
    return 'nis' in agencyable;
}

function isTeacher(agencyable: Agency['agencyable']): agencyable is { id: string; name: string; nip: string; } {
    return 'nip' in agencyable;
}

function MapFallback({ latitude, longitude }: { latitude: string; longitude: string }) {
    const mapUrl = `https://www.google.com/maps?ll=${latitude},${longitude}&z=17&t=m&hl=id-ID&gl=US&mapclient=embed&q=${latitude},${longitude}@${latitude},${longitude}`;

    return (
        <div className="flex items-center justify-center w-full h-full min-h-[300px] bg-muted">
            <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
                <MapIcon className="w-4 h-4" />
                Buka di Google Maps
            </a>
        </div>
    );
}

function MapFrame({ latitude, longitude }: { latitude: string; longitude: string }) {
    const mapUrl = `https://www.google.com/maps?ll=${latitude},${longitude}&z=17&t=m&hl=id-ID&gl=US&mapclient=embed&output=embed`;
    const directUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    return (
        <div className="relative w-full h-full aspect-video group">
            <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
            <a
                href={directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 bg-transparent"
                aria-label="Buka di Google Maps"
            />
        </div>
    );
}

export function AgencyDetail({ agency }: AgencyDetailProps) {
    if (!agency) return null;

    const isStudentType = agency.agencyable_type === 'App\\Models\\Student';

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">{agency.name}</h2>
                <p className="text-muted-foreground">Detail informasi instansi</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">
                            Informasi Instansi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <span>{agency.name}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                            <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                            <span>{agency.address}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">
                            Informasi Pengguna
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span>
                                {agency.agencyable.name} ({isStudentType ? 'Siswa' : 'Guru'})
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>
                                {isStudent(agency.agencyable) ? (
                                    `NIS: ${agency.agencyable.nis}`
                                ) : isTeacher(agency.agencyable) ? (
                                    `NIP: ${agency.agencyable.nip}`
                                ) : null}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Map Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">
                            Lokasi Instansi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-hidden rounded-md">
                            <MapFrame
                                latitude={agency.latitude}
                                longitude={agency.longitude}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
