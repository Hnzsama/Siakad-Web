<?php

namespace App\Service;

use App\Models\ClassLevel;

class ClassLevelService
{
    public function getAllClassLevel()
    {
        return ClassLevel::all();
    }
}
