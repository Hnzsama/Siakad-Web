<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClassLevel extends Model
{
    /** @use HasFactory<\Database\Factories\ClassLevelFactory> */
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function classroom(): HasMany
    {
        return $this->hasMany(Classroom::class);
    }
}
