import { IconActivity, IconBook, IconCircleOff, IconGenderFemale, IconGenderMale, IconTools } from "@tabler/icons-react";

export function Data() {
    const typeFilter = [
        {
            label: 'Teori',
            value: 'theorical',
            icon: IconBook
        },
        {
            label: 'Praktik',
            value: 'practical',
            icon: IconTools
        }
    ]

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

    return { typeFilter, statusFilter };
}
