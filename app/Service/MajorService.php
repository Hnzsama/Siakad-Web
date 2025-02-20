<?php

namespace App\Service;

use App\Models\Major;

class MajorService
{
    public function getAllMajor()
    {
        return Major::all();
    }
}
