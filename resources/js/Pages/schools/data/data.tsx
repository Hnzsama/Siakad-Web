import { usePage } from "@inertiajs/react";
import { IconMapPin, IconSchool } from "@tabler/icons-react";
import { RegionalResponse } from "./schema";

export function Data() {
    const { provinces, regencies, districts } = usePage<RegionalResponse>().props;

    const provinceFilter = provinces.map(province => ({
        label: province.name,
        value: province.code,
        icon: IconMapPin
    }));

    const regencyFilter = regencies.map(regency => ({
        label: regency.name,
        value: regency.code,
        province_code: regency.province_code,
        icon: IconMapPin,
    }));

    const districtFilter = districts.map(district => ({
        label: district.name,
        value: district.code,
        regency_code: district.regency_code,
        icon: IconMapPin,
    }));

    const levelFilter = [
        {
            label: 'SD',
            value: 'sd',
            icon: IconSchool
        },
        {
            label: 'SMP',
            value: 'smp',
            icon: IconSchool
        },
        {
            label: 'SMA',
            value: 'sma',
            icon: IconSchool
        },
        {
            label: 'SMK',
            value: 'smk',
            icon: IconSchool
        }
    ]

    return { provinceFilter, regencyFilter, districtFilter, levelFilter };
}
