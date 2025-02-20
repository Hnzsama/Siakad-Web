<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    /** @use HasFactory<\Database\Factories\StudentFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    protected $guarded = [];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    public function guardian(): BelongsTo
    {
        return $this->belongsTo(Guardian::class);
    }

    public function classroom(): BelongsTo
    {
        return $this->belongsTo(Classroom::class);
    }

    // public function studentHistories(): HasMany
    // {
    //     return $this->hasMany(StudentHistory::class);
    // }

    public function agencies(): MorphMany
    {
        return $this->morphMany(Agency::class, 'agencyable');
    }

    public function attendances(): MorphMany
    {
        return $this->morphMany(Attendance::class, 'attendable');
    }

    public function warningLetters(): HasMany
    {
        return $this->hasMany(WarningLetter::class);
    }

    public function leaveRequests(): MorphMany
    {
        return $this->morphMany(LeaveRequest::class, 'leavable');
    }

    public function violations(): HasMany
    {
        return $this->hasMany(Violation::class);
    }
}
