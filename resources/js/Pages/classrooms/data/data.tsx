import { usePage } from "@inertiajs/react";
import {
    IconNumber,
    IconUsers,
    IconClock,
    IconBuildingSkyscraper
} from "@tabler/icons-react";
import { SelectResponse } from "./schema";

export function Data() {
    const { classLevels, studyGroups, shifts, majors} = usePage<SelectResponse>().props;

    const classLevelFilter = classLevels.map(classLevel => ({
        label: classLevel.alphabet,
        value: classLevel.id,
        icon: IconNumber // Untuk tingkat kelas (X, XI, XII)
    }));

    const studyGroupFilter = studyGroups.map(studyGroup => ({
        label: studyGroup.name,
        value: studyGroup.id,
        icon: IconUsers // Untuk kelompok belajar
    }));

    const shiftFilter = shifts.map(shift => ({
        label: shift.name,
        value: shift.id,
        icon: IconClock // Untuk pergantian waktu/shift
    }));

    const majorFilter = majors.map(major => ({
        label: major.name,
        value: major.id,
        icon: IconBuildingSkyscraper // Untuk jurusan
    }));

    return {
        classLevelFilter,
        studyGroupFilter,
        shiftFilter,
        majorFilter
    };
}
