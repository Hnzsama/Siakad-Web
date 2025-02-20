<?php

namespace App\Service;

use App\Models\StudyGroup;

class StudyGroupService
{
    public function getAllStudyGroup()
    {
        return StudyGroup::all();
    }
}
