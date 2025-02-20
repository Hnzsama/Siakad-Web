import { IconActivity, IconCircleOff, IconGenderFemale, IconGenderMale, IconUsers, IconUserShare } from "@tabler/icons-react";

export function Data() {
    const typeFilter = [
        {
            label: 'Guru',
            value: "App\\Models\\Teacher",
            icon: IconUserShare
        },
        {
            label: 'Siswa',
            value: "App\\Models\\Student",
            icon: IconUsers
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
