<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shift extends Model
{
    /** @use HasFactory<\Database\Factories\ShiftFactory> */
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function classrooms(): HasMany
    {
        return $this->hasMany(Classroom::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    public function teachers(): HasMany
    {
        return  $this->hasMany(Teacher::class);
    }
}
