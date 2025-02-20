<?php

namespace App\Service;

use App\Models\Shift;

class ShiftService
{
    public function getAllShift()
    {
        return Shift::all();
    }
}
