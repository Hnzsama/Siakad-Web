<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StudyGroup extends Model
{
    /** @use HasFactory<\Database\Factories\StudyGroupFactory> */
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function classroom(): HasMany
    {
        return $this->hasMany(Classroom::class);
    }
}
