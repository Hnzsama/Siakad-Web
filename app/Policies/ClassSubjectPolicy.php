<?php

namespace App\Policies;

use App\Models\ClassSubject;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ClassSubjectPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_class_subject');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ClassSubject $classSubject): bool
    {
        return $user->can('view_class_subject');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_class_subject');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ClassSubject $classSubject): bool
    {
        return $user->can('update_class_subject');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ClassSubject $classSubject): bool
    {
        return $user->can('delete_class_subject');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ClassSubject $classSubject): bool
    {
        return $user->can('restore_class_subject');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ClassSubject $classSubject): bool
    {
        return $user->can('force_delete_class_subject');
    }
}
