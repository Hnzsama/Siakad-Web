<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Classroom extends Model
{
    /** @use HasFactory<\Database\Factories\ClassroomFactory> */
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function homeroomTeacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }

    public function major(): BelongsTo
    {
        return $this->belongsTo(Major::class);
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    public function studyGroup(): BelongsTo
    {
        return $this->belongsTo(StudyGroup::class);
    }

    public function classLevel(): BelongsTo
    {
        return $this->belongsTo(ClassLevel::class);
    }

    public function classSubjects(): HasMany
    {
        return $this->hasMany(ClassSubject::class);
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class)
                    ->using(ClassSubject::class)
                    ->withPivot('day', 'start_time', 'end_time', 'is_active');
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    // public function studentHistories(): HasMany
    // {
    //     return $this->hasMany(StudentHistory::class);
    // }

    public function agencies(): HasMany
    {
        return $this->hasMany(Agency::class);
    }
}
