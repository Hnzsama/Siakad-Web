<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendanceSetting extends Model
{
    /** @use HasFactory<\Database\Factories\AttendanceSettingFactory> */
    use HasFactory, HasUuids;

    protected $guarded = [];
}
