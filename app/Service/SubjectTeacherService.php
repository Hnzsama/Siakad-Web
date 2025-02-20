<?php

namespace App\Service;

use App\Models\SubjectTeacher;

class SubjectTeacherService
{
    public function getAllSubjectTeacher()
    {
        return SubjectTeacher::with(['subject', 'teacher'])->get();
    }
}
