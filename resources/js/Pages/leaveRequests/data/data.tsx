import { IconActivity, IconBook, IconCheck, IconCircleOff, IconClock, IconGenderFemale, IconGenderMale, IconTools, IconUsers, IconUserShare, IconX } from "@tabler/icons-react";

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
            label: 'Disetujui',
            value: 'Approved',
            icon: IconCheck
        },
        {
            label: 'Ditolak',
            value: 'Rejected',
            icon: IconX
        },
        {
            label: 'Menunggu',
            value: 'Pending',
            icon: IconClock
        }
    ];

    return { typeFilter, statusFilter };
}
