import InfoItem from './info-item';
import { Guardian } from '../data/schema';
import { BriefcaseIcon, HomeIcon, MailIcon, PhoneIcon, UserIcon, HeartIcon, Users } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GuardianInfoProps {
    guardian: Guardian;
}

export function GuardianInfo({ guardian }: GuardianInfoProps) {
    return (
        <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Informasi Pribadi</h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <InfoItem
                                icon={<UserIcon className="w-4 h-4" />}
                                label="NIK"
                                value={guardian.nik}
                                badge
                                variant="secondary"
                            />
                            <InfoItem
                                icon={<HeartIcon className="w-4 h-4" />}
                                label="Status"
                                value={guardian.relationship}
                                badge
                            />
                            <InfoItem
                                icon={<BriefcaseIcon className="w-4 h-4" />}
                                label="Pekerjaan"
                                value={guardian.occupation || "Tidak ada"}
                            />
                            <InfoItem
                                icon={<Users className="w-4 h-4" />}
                                label="Jumlah Anak"
                                value={`${guardian.children?.length || 0} Anak`}
                                badge
                                variant="secondary"
                            />
                            <InfoItem
                                icon={<HomeIcon className="w-4 h-4" />}
                                label="Alamat"
                                value={guardian.address}
                            />
                            <InfoItem
                                icon={<PhoneIcon className="w-4 h-4" />}
                                label="Telepon"
                                value={guardian.phone}
                                badge
                            />
                        </div>
                    </div>
                </div>

                {/* Email & Quick Actions */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Kontak Cepat</h3>
                    <div className="space-y-4">
                        <InfoItem
                            icon={<MailIcon className="w-4 h-4" />}
                            label="Email"
                            value={guardian.email || "Tidak ada"}
                            badge
                            variant="secondary"
                        />
                        <div className="grid gap-2">
                            {guardian.phone && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => window.location.href = `tel:${guardian.phone}`}
                                >
                                    <PhoneIcon className="w-4 h-4 mr-2" />
                                    Hubungi
                                </Button>
                            )}
                            {guardian.email && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => window.location.href = `mailto:${guardian.email}`}
                                >
                                    <MailIcon className="w-4 h-4 mr-2" />
                                    Kirim Email
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
