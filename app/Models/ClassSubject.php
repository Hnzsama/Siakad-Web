<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ClassSubject extends Pivot
{
    use HasUuids, HasFactory;

    protected $table = 'class_subjects';

    public $timestamps = true;

    protected $guarded = [];

    // Add this if you're using UUID
    public $incrementing = false;

    public function subjectTeacher(): BelongsTo
    {
        return $this->belongsTo(SubjectTeacher::class);
    }

    public function classroom(): BelongsTo
    {
        return $this->belongsTo(Classroom::class);
    }

    public function classLevel(): HasOneThrough
    {
        return $this->hasOneThrough(
            ClassLevel::class,
            Classroom::class,
            'id',            // Foreign key di Classroom
            'id',            // Primary key di ClassLevel
            'classroom_id',  // Foreign key di ClassSubject
            'class_level_id' // Foreign key di Classroom
        );
    }
}
