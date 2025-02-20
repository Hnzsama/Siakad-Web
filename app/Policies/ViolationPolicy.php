<?php

namespace App\Policies;

use App\Models\Violation;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ViolationPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_violation');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Violation $violation): bool
    {
        return $user->can('view_violation');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_violation');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Violation $violation): bool
    {
        return $user->can('update_violation');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Violation $violation): bool
    {
        return $user->can('delete_violation');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Violation $violation): bool
    {
        return $user->can('restore_violation');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Violation $violation): bool
    {
        return $user->can('force_delete_violation');
    }
}

