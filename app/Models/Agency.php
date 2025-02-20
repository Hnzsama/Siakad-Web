<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Agency extends Model
{
    /** @use HasFactory<\Database\Factories\AgencyFactory> */
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function agencyable(): MorphTo
    {
        return $this->morphTo();
    }
}
