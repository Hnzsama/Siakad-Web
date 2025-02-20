<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Province extends Model
{
    /** @use HasFactory<\Database\Factories\ProvinceFactory> */
    use HasFactory;

    protected $guarded = [];

    public function regencies(): HasMany
    {
        return $this->hasMany(Regency::class);
    }

    public function schools(): HasMany
    {
        return $this->hasMany(School::class);
    }

    public function districts(): HasManyThrough
    {
        return $this->hasManyThrough(District::class, Regency::class, 'province_code', 'regency_code');
    }
}
