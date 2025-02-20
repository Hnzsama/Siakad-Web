import { usePage } from "@inertiajs/react";
import { IconActivity, IconCircleOff, IconClock, IconGenderFemale, IconGenderMale } from "@tabler/icons-react";
import { SelectResponse } from "./schema";

export function Data() {
  const { shifts } = usePage<SelectResponse>().props

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

  const shiftFilter = shifts.map(shift => ({
    label: shift.name,
    value: shift.id,
    icon: IconClock // Untuk pergantian waktu/shift
  }));

  return { genderFilter, statusFilter, shiftFilter };
}
