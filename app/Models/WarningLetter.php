<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WarningLetter extends Model
{
    /** @use HasFactory<\Database\Factories\WarningLetterFactory> */
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function warningCategory(): BelongsTo
    {
        return $this->belongsTo(WarningCategory::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Guardian::class, 'parent_id');
    }

    public function repellent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
