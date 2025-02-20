<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ViolationType extends Model
{
    /** @use HasFactory<\Database\Factories\ViolationTypeFactory> */
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function violations(): HasMany
    {
        return $this->hasMany(Violation::class);
    }
}
