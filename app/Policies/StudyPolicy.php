<?php

namespace App\Policies;

use App\Models\Study;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class StudyPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Adjust logic as needed
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Study $study): bool
    {
        return true; // Adjust logic as needed
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return auth()->user()->can('create studies'); // Adjust logic as needed
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Study $study): bool
    {
        return auth()->user()->can('update studies'); // Adjust logic as needed
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Study $study): bool
    {
        return auth()->user()->can('delete studies'); // Adjust logic as needed
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Study $study): bool
    {
        return auth()->user()->can('restore studies'); // Adjust logic as needed
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Study $study): bool
    {
        return auth()->user()->can('force delete studies'); // Adjust logic as needed
    }
}
