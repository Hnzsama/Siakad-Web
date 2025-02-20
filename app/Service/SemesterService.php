<?php

namespace App\Service;

use App\Models\Semester;

class SemesterService
{
    public function getAllSemester()
    {
        return Semester::all();
    }
}
