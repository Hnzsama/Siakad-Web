<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Attendance extends Model
{
    /** @use HasFactory<\Database\Factories\AttendanceFactory> */
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function attendable(): MorphTo
    {
        return $this->morphTo();
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }
}
