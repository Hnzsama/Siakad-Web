import { Building2, MapPin, ExternalLink, MapIcon } from 'lucide-react';
import { Agency } from '../data/schema';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface AgencyListProps {
    agencies: Agency[];
}

function MapFallback({ latitude, longitude }: { latitude: string; longitude: string }) {
    const mapUrl = `https://www.google.com/maps?ll=${latitude},${longitude}&z=17&t=m&hl=id-ID&gl=US&mapclient=embed&q=${latitude},${longitude}@${latitude},${longitude}`;

    return (
        <div className="flex items-center justify-center w-full h-[200px] bg-muted">
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
        <div className="w-full h-[300px] relative group">
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

export function AgencyList({ agencies }: AgencyListProps) {
    const [openMapId, setOpenMapId] = useState<string | null>(null);

    if (agencies.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <Building2 className="w-16 h-16 text-muted-foreground" />
                <div className="space-y-2 text-center">
                    <h3 className="text-xl font-semibold">Belum Ada Instansi</h3>
                    <p className="text-muted-foreground">
                        Anda belum terdaftar di instansi manapun
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Daftar Instansi</h2>
                <p className="text-muted-foreground">
                    Instansi yang terdaftar
                </p>
            </div>

            <div className="grid gap-6">
                {agencies.map((agency) => (
                    <div key={agency.id}
                         className="relative overflow-hidden transition-all border rounded-lg group hover:shadow-lg">
                        <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent group-hover:opacity-100" />

                        {/* Main Info Section */}
                        <div className="relative flex flex-col gap-6 p-6 md:flex-row">
                            {/* Agency Icon/Logo */}
                            <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 rounded-full bg-primary/10">
                                <Building2 className="w-8 h-8 text-primary" />
                            </div>

                            {/* Agency Details */}
                            <div className="flex-grow">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-semibold">{agency.name}</h3>
                                        <Badge variant="outline" className="text-xs">
                                            {agency.status ? 'Aktif' : 'Tidak Aktif'}
                                        </Badge>
                                    </div>
                                    <p className="flex items-center gap-2 mt-1 text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        {agency.address}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center flex-shrink-0 gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setOpenMapId(openMapId === agency.id ? null : agency.id)}
                                    className="flex items-center gap-2"
                                >
                                    <MapIcon className="w-4 h-4" />
                                    {openMapId === agency.id ? 'Tutup Peta' : 'Lihat Lokasi'}
                                </Button>
                            </div>
                        </div>

                        {/* Map Section */}
                        {openMapId === agency.id && (
                            <div className="border-t">
                                <MapFrame
                                    latitude={agency.latitude}
                                    longitude={agency.longitude}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
