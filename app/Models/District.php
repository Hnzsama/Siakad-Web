<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class District extends Model
{
    /** @use HasFactory<\Database\Factories\DistrictFactory> */
    use HasFactory;

    protected $guarded = [];

    public function province(): HasOneThrough
    {
        return $this->hasOneThrough(Province::class, Regency::class, 'code', 'province_code');
    }

    public function regency(): BelongsTo
    {
        return $this->belongsTo(Regency::class, 'regency_code', 'code');
    }

    public function schools(): HasMany
    {
        return $this->hasMany(School::class);
    }
}
