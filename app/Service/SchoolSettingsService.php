<?php

namespace App\Service;

use App\Models\School;
use Illuminate\Support\Facades\Cache;

class SchoolSettingsService
{
    private const CACHE_KEY = 'school_settings';
    private const CACHE_TTL = 3600; // 1 hour

    public function getSchoolSettings()
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return School::first();
        });
    }

    public function updateSchoolSettings(array $data)
    {
        $school = School::first();

        if (!$school) {
            $school = School::create($data);
        } else {
            $school->update($data);
        }

        // Clear the cache
        Cache::forget(self::CACHE_KEY);

        return $school;
    }
}
