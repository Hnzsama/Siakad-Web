import { IconActivity, IconChecks, IconClock } from "@tabler/icons-react";

export function Data() {
    const typeFilter = [
        {
            label: 'Genap',
            value: 'even',
            icon: IconActivity
        },
        {
            label: 'Ganjil',
            value: 'odd',
            icon: IconChecks
        }
    ]

    const statusFilter = [
        {
            label: 'Aktif',
            value: 'active',
            icon: IconActivity
        },
        {
            label: 'Selesai',
            value: 'completed',
            icon: IconChecks
        },
        {
            label: 'Menunggu',
            value: 'pending',
            icon: IconClock
        }
    ]

    return { typeFilter,statusFilter };
}
