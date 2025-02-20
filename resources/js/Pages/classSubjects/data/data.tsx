import { usePage } from "@inertiajs/react";
import { IconActivity, IconBuildingCommunity, IconCircleOff, IconGenderFemale, IconGenderMale } from "@tabler/icons-react";
import { FilterResponse } from "./schema";

export function Data() {
    const { teachers, classrooms, subjects } = usePage<FilterResponse>().props

    const teacherFilter = teachers.map(teacher => ({
        label: teacher.name,
        value: teacher.id,
        icon: IconBuildingCommunity
    }));

    const classroomFilter = classrooms.map(classroom => ({
        label: classroom.name,
        value: classroom.id,
        icon: IconBuildingCommunity
    }));

    const subjectFilter = subjects.map(subject => ({
        label: subject.name,
        value: subject.id,
        icon: IconBuildingCommunity
    }));

    return { teacherFilter, classroomFilter, subjectFilter };
}
