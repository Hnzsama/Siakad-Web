import { IconActivity, IconCircleOff, IconGenderFemale, IconGenderMale } from "@tabler/icons-react";

export function Data() {
    const genderFilter = [
        {
            label: 'Laki-laki',
            value: 'Male',
            icon: IconGenderMale
        },
        {
            label: 'Perempuan',
            value: 'Female',
            icon: IconGenderFemale
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

    return { genderFilter, statusFilter };
}
