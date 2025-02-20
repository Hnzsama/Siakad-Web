<?php

namespace App\Policies;

use App\Models\StudyGroup;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class StudyGroupPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_study_group');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, StudyGroup $studyGroup): bool
    {
        return $user->can('view_study_group');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_study_group');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, StudyGroup $studyGroup): bool
    {
        return $user->can('update_study_group');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, StudyGroup $studyGroup): bool
    {
        return $user->can('delete_study_group');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, StudyGroup $studyGroup): bool
    {
        return $user->can('restore_study_group');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, StudyGroup $studyGroup): bool
    {
        return $user->can('force_delete_study_group');
    }
}

