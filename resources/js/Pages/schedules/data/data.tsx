import { usePage } from "@inertiajs/react";
import { IconActivity, IconCircleOff, IconGenderFemale, IconGenderMale, IconTimeDuration5 } from "@tabler/icons-react";
import { FilterResponse } from "./schema";

export function Data() {
    const { shifts } = usePage<FilterResponse>().props

    const shiftFilter = shifts.map(shift => ({
        label: shift.name,
        value: shift.id,
        icon: IconTimeDuration5
    }));

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

    return { shiftFilter, statusFilter };
}
