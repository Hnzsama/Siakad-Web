<?php

namespace App\Policies;

use App\Models\Regency;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RegencyPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_regency');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Regency $regency): bool
    {
        return $user->can('view_regency');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_regency');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Regency $regency): bool
    {
        return $user->can('update_regency');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Regency $regency): bool
    {
        return $user->can('delete_regency');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Regency $regency): bool
    {
        return $user->can('restore_regency');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Regency $regency): bool
    {
        return $user->can('force_delete_regency');
    }
}

