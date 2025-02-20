<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Subject extends Model
{
    /** @use HasFactory<\Database\Factories\SubjectFactory> */
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function teachers(): BelongsToMany
    {
        return $this->belongsToMany(Teacher::class)
                    ->using(ClassSubject::class)
                    ->withPivot('day', 'start_time', 'end_time', 'is_active');
    }

    public function classrooms(): BelongsToMany
    {
        return $this->belongsToMany(Classroom::class)
                    ->using(ClassSubject::class)
                    ->withTimestamps();
    }
}
