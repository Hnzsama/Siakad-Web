<?php

namespace App\Policies;

use App\Models\SubjectTeacher;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SubjectTeacherPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_subject_teacher');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, SubjectTeacher $subjectTeacher): bool
    {
        return $user->can('view_subject_teacher', $subjectTeacher);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_subject_teacher');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, SubjectTeacher $subjectTeacher): bool
    {
        return $user->can('update_subject_teacher', $subjectTeacher);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, SubjectTeacher $subjectTeacher): bool
    {
        return $user->can('delete_subject_teacher', $subjectTeacher);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, SubjectTeacher $subjectTeacher): bool
    {
        return $user->can('restore_subject_teacher', $subjectTeacher);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, SubjectTeacher $subjectTeacher): bool
    {
        return $user->can('force_delete_subject_teacher', $subjectTeacher);
    }
}
