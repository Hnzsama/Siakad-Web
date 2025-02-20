<?php

namespace App\Service;

use App\Models\Classroom;

class ClassroomService
{
    public function getAllClassrooms()
    {
        $classrooms = Classroom::with(['homeroomTeacher', 'major', 'shift', 'studyGroup', 'classLevel'])
            ->get()
            ->map(function ($classroom) {
                // Copy all existing properties
                $data = $classroom->toArray();

                // Override hanya field name
                $name = $classroom->classLevel->alphabet;

                if ($classroom->major) {
                    $majorNameParts = explode(' ', $classroom->major->name);

                    // Ambil huruf pertama dari setiap kata
                    $initials = strtoupper(substr($majorNameParts[0], 0, 1) . substr($majorNameParts[1] ?? '', 0, 1));

                    // Tambahkan huruf kedua jika bentrok
                    if ($initials === 'TI') {
                        $secondChar = substr($majorNameParts[1] ?? '', 1, 1);
                        $initials .= strtoupper($secondChar);
                    }

                    $name .= ' ' . $initials;
                }

                if ($classroom->studyGroup) {
                    $name .= ' ' . $classroom->studyGroup->name;
                }

                $data['name'] = $name;

                return $data;
            });

        return $classrooms;
    }

    public function getClassroomTeacher(string $id)
    {
        $classrooms = Classroom::with(['homeroomTeacher', 'major', 'shift', 'studyGroup', 'classLevel'])
            ->whereHas('classSubjects.subjectTeacher', function ($query) use ($id) {
                $query->where('teacher_id', $id);
            })
            ->get()
            ->map(function ($classroom) {
                $data = $classroom->toArray();

                // Override hanya field name
                $name = $classroom->classLevel->alphabet;

                if ($classroom->major) {
                    $majorNameParts = explode(' ', $classroom->major->name);

                    // Ambil huruf pertama dari setiap kata
                    $initials = strtoupper(substr($majorNameParts[0], 0, 1) . substr($majorNameParts[1] ?? '', 0, 1));

                    // Tambahkan huruf kedua jika bentrok
                    if ($initials === 'TI') {
                        $secondChar = substr($majorNameParts[1] ?? '', 1, 1);
                        $initials .= strtoupper($secondChar);
                    }

                    $name .= ' ' . $initials;
                }

                if ($classroom->studyGroup) {
                    $name .= ' ' . $classroom->studyGroup->name;
                }

                $data['name'] = $name;

                return $data;
            });

        return $classrooms;
    }

    public function getSpecificClassroom(string $id)
    {
        $classroom = Classroom::with(['homeroomTeacher', 'students', 'major', 'shift', 'shift.schedules', 'studyGroup', 'classLevel'])
            ->find($id);

        if (!$classroom) {
            // Handle jika classroom tidak ditemukan
            return response()->json(['message' => 'Classroom not found'], 404);
        }

        // Proses data
        $data = $classroom->toArray();

        // Override hanya field name
        $name = $classroom->classLevel->alphabet;

        if ($classroom->major) {
            $majorNameParts = explode(' ', $classroom->major->name);

            // Ambil huruf pertama dari setiap kata
            $initials = strtoupper(substr($majorNameParts[0], 0, 1) . substr($majorNameParts[1] ?? '', 0, 1));

            // Tambahkan huruf kedua jika bentrok
            if ($initials === 'TI') {
                $secondChar = substr($majorNameParts[1] ?? '', 1, 1);
                $initials .= strtoupper($secondChar);
            }

            $name .= ' ' . $initials;
        }

        if ($classroom->studyGroup) {
            $name .= ' ' . $classroom->studyGroup->name;
        }

        $data['name'] = $name;

        return $data;
    }

    public function getSpecificClassroomTeacher(string $id)
    {
        $classrooms = Classroom::with(['homeroomTeacher', 'major', 'shift', 'shift.schedules', 'studyGroup', 'classLevel'])
            ->whereHas('classSubjects.subjectTeacher', function ($query) use ($id) {
                $query->where('teacher_id', $id);
            })
            ->get()
            ->map(function ($classroom) {
                $data = $classroom->toArray();

                // Override hanya field name
                $name = $classroom->classLevel->alphabet;

                if ($classroom->major) {
                    $majorNameParts = explode(' ', $classroom->major->name);

                    // Ambil huruf pertama dari setiap kata
                    $initials = strtoupper(substr($majorNameParts[0], 0, 1) . substr($majorNameParts[1] ?? '', 0, 1));

                    // Tambahkan huruf kedua jika bentrok
                    if ($initials === 'TI') {
                        $secondChar = substr($majorNameParts[1] ?? '', 1, 1);
                        $initials .= strtoupper($secondChar);
                    }

                    $name .= ' ' . $initials;
                }

                if ($classroom->studyGroup) {
                    $name .= ' ' . $classroom->studyGroup->name;
                }

                $data['name'] = $name;

                return $data;
            });

        return $classrooms;
    }

    private function generateUniqueInitials($majorName, &$usedInitials)
    {
        // Ambil kata pertama dan kedua dari nama jurusan
        $majorNameParts = explode(' ', $majorName);
        $initials = strtoupper(substr($majorNameParts[0], 0, 1) . substr($majorNameParts[1] ?? '', 0, 1));

        // Jika inisial sudah ada, tambahkan angka secara dinamis
        $originalInitials = $initials;
        $counter = 1;

        // Cek apakah inisial sudah digunakan
        while (in_array($initials, $usedInitials)) {
            $initials = $originalInitials . $counter;
            $counter++;
        }

        // Tandai inisial yang telah digunakan
        $usedInitials[] = $initials;

        return $initials;
    }

    public function formatClassroomName($classroom)
    {
        if (!$classroom) return null;

        $name = $classroom->classLevel->alphabet;

        if ($classroom->major) {
            $majorNameParts = explode(' ', $classroom->major->name);
            $initials = strtoupper(substr($majorNameParts[0], 0, 1) . substr($majorNameParts[1] ?? '', 0, 1));

            if ($initials === 'TI') {
                $secondChar = substr($majorNameParts[1] ?? '', 1, 1);
                $initials .= strtoupper($secondChar);
            }

            $name .= ' ' . $initials;
        }

        if ($classroom->studyGroup) {
            $name .= ' ' . $classroom->studyGroup->name;
        }

        return $name;
    }
}
