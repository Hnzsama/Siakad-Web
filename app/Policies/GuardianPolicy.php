<?php

namespace App\Policies;

use App\Models\Guardian;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class GuardianPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_guardian');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Guardian $guardian): bool
    {
        return $user->can('view_guardian');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_guardian');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Guardian $guardian): bool
    {
        return $user->can('update_guardian');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Guardian $guardian): bool
    {
        return $user->can('delete_guardian');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Guardian $guardian): bool
    {
        return $user->can('restore_guardian');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Guardian $guardian): bool
    {
        return $user->can('force_delete_guardian');
    }
}

