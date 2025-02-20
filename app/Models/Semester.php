<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Semester extends Model
{
    /** @use HasFactory<\Database\Factories\SemesterFactory> */
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    // public function studentHistories(): HasMany
    // {
    //     return $this->hasMany(StudentHistory::class);
    // }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function warningLetters(): HasMany
    {
        return $this->hasMany(WarningLetter::class);
    }

    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function violations(): HasMany
    {
        return $this->hasMany(Violation::class);
    }
}
