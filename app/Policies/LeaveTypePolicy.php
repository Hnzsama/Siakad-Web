<?php

namespace App\Policies;

use App\Models\LeaveType;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class LeaveTypePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_leave_type');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, LeaveType $leaveType): bool
    {
        return $user->can('view_leave_type');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_leave_type');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, LeaveType $leaveType): bool
    {
        return $user->can('update_leave_type');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, LeaveType $leaveType): bool
    {
        return $user->can('delete_leave_type');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, LeaveType $leaveType): bool
    {
        return $user->can('restore_leave_type');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, LeaveType $leaveType): bool
    {
        return $user->can('force_delete_leave_type');
    }
}

