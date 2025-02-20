import { IconActivity, IconCircleOff, IconGenderFemale, IconGenderMale } from "@tabler/icons-react";

export function Data() {
    const statusFilter = [
        {
            label: 'Aktif',
            value: 1,
            icon: IconActivity
        },
        {
            label: 'Nonaktif',
            value: 0,
            icon: IconCircleOff
        },
    ]

    return { statusFilter };
}
