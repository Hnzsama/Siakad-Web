<?php

namespace App\Service;

use App\Models\Subject;

class SubjectService
{
    public function getAllSubject()
    {
        return Subject::all();
    }
}
