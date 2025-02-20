<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    /** @use HasFactory<\Database\Factories\TeacherFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    protected $guarded = [];

    /**
     * Get the user associated with the teacher.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the shift associated with the teacher.
     */
    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    /**
     * Get the classroom where teacher is assigned as homeroom teacher.
     */
    public function homeroomTeacher(): HasOne
    {
        return $this->hasOne(Classroom::class, 'teacher_id');
    }

    /**
     * Get all subjects that the teacher can teach.
     */
    public function subjects(): BelongsToMany
    {
        return $this->belongsToMany(Subject::class, 'subject_teacher')
                    ->using(SubjectTeacher::class)
                    ->withTimestamps();
    }

    /**
     * Get all classrooms where the teacher teaches through class_subjects.
     */
    public function classrooms(): BelongsToMany
    {
        return $this->belongsToMany(Classroom::class, 'class_subjects')
                    ->using(ClassSubject::class)
                    ->withPivot(['type', 'day', 'start_time', 'end_time', 'status'])
                    ->through('subjectTeachers');
    }

    public function classroomStudent(): HasManyThrough
    {
        return $this->hasManyThrough(
            Student::class,
            Classroom::class,
            'teacher_id', // Foreign key on classrooms table
            'classroom_id', // Foreign key on students table
            'id', // Local key on teachers table
            'id' // Local key on classrooms table
        );
    }

    /**
     * Get all subject-teacher assignments.
     */
    public function subjectTeachers(): HasMany
    {
        return $this->hasMany(SubjectTeacher::class);
    }

    /**
     * Get all class subjects through subject teachers.
     */
    public function classSubjects(): HasManyThrough
    {
        return $this->hasManyThrough(
            ClassSubject::class,
            SubjectTeacher::class,
            'teacher_id', // Foreign key on subject_teacher table
            'subject_teacher_id', // Foreign key on class_subjects table
            'id', // Local key on teachers table
            'id' // Local key on subject_teacher table
        );
    }

    /**
     * Get all attendance records for the teacher.
     */
    public function attendances(): MorphMany
    {
        return $this->morphMany(Attendance::class, 'attendable');
    }

    /**
     * Get all agency records for the teacher.
     */
    public function agencies(): MorphMany
    {
        return $this->morphMany(Agency::class, 'agencyable');
    }

    /**
     * Get all leave requests for the teacher.
     */
    public function leaveRequests(): MorphMany
    {
        return $this->morphMany(LeaveRequest::class, 'leavable');
    }
}
