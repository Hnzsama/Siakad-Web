<?php

namespace App\Service;

use App\Models\ViolationType;

class ViolationTypeService
{
    public function getAllViolationType()
    {
        return ViolationType::all();
    }
}
