import { IconChecks, IconClipboardList, IconClock, IconHeart, IconUsers, IconUserShare, IconX } from "@tabler/icons-react";

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
            label: 'Hadir',
            value: 'Present',
            icon: IconChecks
        },
        {
            label: 'Terlambat',
            value: 'Late',
            icon: IconClock
        },
        {
            label: 'Tidak Hadir',
            value: 'Absent',
            icon: IconX
        },
        {
            label: 'Izin',
            value: 'Permission',
            icon: IconClipboardList
        },
        {
            label: 'Sakit',
            value: 'Sick',
            icon: IconHeart
        },
    ];

    return { typeFilter, statusFilter };
}
