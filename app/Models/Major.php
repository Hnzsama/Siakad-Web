<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Major extends Model
{
    /** @use HasFactory<\Database\Factories\MajorFactory> */
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function classrooms(): HasMany
    {
        return $this->hasMany(Classroom::class);
    }
}
