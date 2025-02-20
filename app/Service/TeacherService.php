<?php

namespace App\Service;

use App\Models\Teacher;

class TeacherService
{
    public function getAllTeacher()
    {
        return Teacher::all();
    }

    public function getTeacherNotHomeroooTeacher()
    {
        return Teacher::query()->whereDoesntHave('homeroomTeacher')->get();
    }
}
