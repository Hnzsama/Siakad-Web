<?php

namespace App\Service;

use App\Models\WarningCategory;

class WarningCategoryService
{
    public function getAllWarningCategory()
    {
        return WarningCategory::all();
    }
}
