import { usePage } from "@inertiajs/react";
import { IconBuildingCommunity, IconCalendar, IconGenderFemale, IconGenderMale, IconSchool, IconUserCheck, IconUserMinus, IconUserOff } from "@tabler/icons-react";
import { FilterResponse } from "./schema";

export function Data() {
    const { semesters, classrooms } = usePage<FilterResponse>().props

    const semesterFilter = semesters.map(semester => ({
        label: semester.type == 'odd' ? `Ganjil ${semester.academic_year}` : `Genap ${semester.academic_year}`,
        value: semester.id,
        icon: IconBuildingCommunity
    }));

    const classroomFilter = classrooms.map(classroom => ({
        label: classroom.name,
        value: classroom.id,
        icon: IconBuildingCommunity
    }));

    return { semesterFilter, classroomFilter };
}
