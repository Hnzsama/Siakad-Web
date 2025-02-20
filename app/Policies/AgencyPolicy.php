<?php

namespace App\Policies;

use App\Models\Agency;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AgencyPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_agency');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Agency $agency): bool
    {
        return $user->can('view_agency');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_agency');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Agency $agency): bool
    {
        return $user->can('update_agency');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Agency $agency): bool
    {
        return $user->can('delete_agency');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Agency $agency): bool
    {
        return $user->can('restore_agency');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Agency $agency): bool
    {
        return $user->can('force_delete_agency');
    }
}
