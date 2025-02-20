<?php

namespace App\Service;

use App\Models\Student;

class StudentService
{
    public function getAllStudent()
    {
        return Student::all();
    }

    public function getStudentWithGuardian()
    {
        return Student::with('guardian')->get();
    }
}
