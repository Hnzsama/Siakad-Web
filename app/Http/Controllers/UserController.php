<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        $this->authorizeResource(User::class, 'user');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('roles')->get();
        // return response()->json($users);
        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function resetUserLock(User $user)
    {
        // Pastikan yang akses adalah admin
        $user = Auth::user();
        assert($user instanceof User);

        if (!$user->hasRole('admin')) {
            throw new \Exception('Unauthorized', 403);
        }

        $user->update([
            'is_locked' => false,
            'locked_reason' => null,
            'locked_at' => null
        ]);

        $relatedModel = $user->hasRole('student') ? $user->siswa : $user->teacher;

        return redirect()->back()->with('success', 'User ' . $relatedModel->name . ' berhasil di-unlock');
    }

    // Endpoint untuk melihat daftar user yang terkunci
    public function getLockedUsers()
    {
        $user = Auth::user();
        assert($user instanceof User);

        if (!$user->hasRole('admin')) {
            throw new \Exception('Unauthorized', 403);
        }

        $lockedUsers = User::where('is_locked', true)
            ->with(['roles', 'siswa', 'teacher'])
            ->get()
            ->map(function ($user) {
                $relatedModel = $user->hasRole('student') ? $user->siswa : $user->teacher;
                return [
                    'user_id' => $user->id,
                    'name' => $relatedModel->name,
                    'id' => $relatedModel->id,
                    'role' => $user->getRoleNames(),
                    'locked_at' => $user->locked_at,
                    'locked_reason' => $user->locked_reason
                ];
            });

        return Inertia::render('users/locked', [
            'users' => $lockedUsers
        ]);
    }
}
