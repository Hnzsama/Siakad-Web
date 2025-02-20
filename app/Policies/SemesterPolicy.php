<?php

namespace App\Policies;

use App\Models\Semester;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SemesterPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_semester');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Semester $semester): bool
    {
        return $user->can('view_semester');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_semester');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Semester $semester): bool
    {
        return $user->can('update_semester');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Semester $semester): bool
    {
        return $user->can('delete_semester');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Semester $semester): bool
    {
        return $user->can('restore_semester');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Semester $semester): bool
    {
        return $user->can('force_delete_semester');
    }
}

