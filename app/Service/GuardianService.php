<?php

namespace App\Service;

use App\Models\Guardian;

class GuardianService
{
    public function getAllGuardian()
    {
        return Guardian::all();
    }
}
