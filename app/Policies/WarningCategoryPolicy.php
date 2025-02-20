<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WarningCategory;
use Illuminate\Auth\Access\Response;

class WarningCategoryPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_warning_category');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, WarningCategory $warningCategory): bool
    {
        return $user->can('view_warning_category');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_warning_category');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, WarningCategory $warningCategory): bool
    {
        return $user->can('update_warning_category');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, WarningCategory $warningCategory): bool
    {
        return $user->can('delete_warning_category');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, WarningCategory $warningCategory): bool
    {
        return $user->can('restore_warning_category');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, WarningCategory $warningCategory): bool
    {
        return $user->can('force_delete_warning_category');
    }
}

