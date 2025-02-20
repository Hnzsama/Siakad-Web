import { IconActivity, IconBuildingCommunity, IconCircleOff, IconGenderFemale, IconGenderMale } from "@tabler/icons-react";
import { FilterResponse } from "./schema";
import { usePage } from "@inertiajs/react";

export function Data() {
    const { teachers, subjects } = usePage<FilterResponse>().props

    const teacherFilter = teachers.map(teacher => ({
        label: teacher.name,
        value: teacher.id,
        icon: IconBuildingCommunity
    }));

    const subjectFilter = subjects.map(subject => ({
        label: subject.name,
        value: subject.id,
        icon: IconBuildingCommunity
    }));

    return { teacherFilter, subjectFilter };
}
