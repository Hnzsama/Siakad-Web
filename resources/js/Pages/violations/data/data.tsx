import { IconActivity, IconBook, IconCircleOff, IconGenderFemale, IconGenderMale, IconTools, IconX } from "@tabler/icons-react";
import { FilterResponse } from "./schema";
import { usePage } from "@inertiajs/react";

export function Data() {
    const { violationTypes } = usePage<FilterResponse>().props

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

    const violationTypeFilter = violationTypes.map(violationType => ({
        label: violationType.name,
        value: violationType.id,
        icon: IconActivity
    }))

    return { statusFilter, violationTypeFilter };
}
