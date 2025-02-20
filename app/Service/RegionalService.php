<?php

namespace App\Service;

use App\Models\District;
use App\Models\Province;
use App\Models\Regency;

class RegionalService
{
    public function getRegional()
    {
        $provinces = Province::all();
        $regencies = Regency::with('province')->get();
        $districts = District::with('regency')->get();

        return compact('provinces', 'regencies', 'districts');
    }
}
