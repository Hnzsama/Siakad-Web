import { usePage } from "@inertiajs/react";
import { IconBuildingCommunity, IconCalendar, IconGenderFemale, IconGenderMale, IconSchool, IconUserCheck, IconUserMinus, IconUserOff } from "@tabler/icons-react";
import { FilterResponse } from "./schema";

export function Data() {
    const { classrooms } = usePage<FilterResponse>().props

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
            value: 'Active',
            icon: IconUserCheck
        },
        {
            label: 'Lulus',
            value: 'Graduated',
            icon: IconSchool
        },
        {
            label: 'Keluar',
            value: 'Dropped Out',
            icon: IconUserMinus
        }
    ]

    const semesterFilter = [
        {
            label: 'Ganjil',
            value: 'Odd',
            icon: IconCalendar
        },
        {
            label: 'Genap',
            value: 'Even',
            icon: IconCalendar
        }
    ]

    const classroomFilter = [
        {
            label: 'Belum Ada Kelas',
            value: null,
            icon: IconBuildingCommunity
        },
        ...classrooms.map(classroom => ({
            label: classroom.name,
            value: classroom.id,
            icon: IconBuildingCommunity
        }))
    ];

    const guardianFilter = [
        {
            label: 'Belum Ada Wali',
            value: null,
            icon: IconUserOff
        }
    ];

    return { genderFilter, statusFilter, semesterFilter, classroomFilter, guardianFilter };
}
