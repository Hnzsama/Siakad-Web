<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WarningCategory extends Model
{
    /** @use HasFactory<\Database\Factories\WarningCategoryFactory> */
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function warnings(): HasMany
    {
        return $this->hasMany(WarningLetter::class);
    }
}
