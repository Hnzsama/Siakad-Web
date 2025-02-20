import { IconActivity, IconBook, IconCircleOff, IconGenderFemale, IconGenderMale, IconTools, IconX } from "@tabler/icons-react";

export function Data() {
    const statusFilter = [
        {
            label: 'Disetujui',
            value: 'approved',
            icon: IconActivity
        },
        {
            label: 'Menunggu',
            value: 'pending',
            icon: IconCircleOff
        },
        {
            label: 'Dibatalkan',
            value: 'cancelled',
            icon: IconX
        },
    ]

    return { statusFilter };
}
