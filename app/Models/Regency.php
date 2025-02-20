<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Regency extends Model
{
    /** @use HasFactory<\Database\Factories\RegencyFactory> */
    use HasFactory;

    protected $guarded = [];

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class, 'province_code', 'code');
    }

    public function districts(): HasMany
    {
        return $this->hasMany(District::class);
    }

    public function schools(): HasMany
    {
        return $this->hasMany(School::class);
    }
}
