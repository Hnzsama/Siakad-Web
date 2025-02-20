<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DynamicPrefixMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();
        assert($user instanceof User);
        Log::info('DynamicPrefix - User:', [
            'id' => $user?->id,
            'email' => $user?->email,
            'roles' => $user?->getRoleNames()
        ]);

        if (!$user instanceof User) {
            Log::error('DynamicPrefix - Invalid user instance');
            abort(403);
        }

        // Map roles to allowed prefixes
        $allowedPrefixes = match(true) {
            $user->hasRole('admin') => 'admin',
            $user->hasRole('teacher') => 'teacher',
            $user->hasRole('student') => 'student',
            $user->hasRole('guardian') => 'guardian',
            default => ''
        };

        // Set the prefix as singleton
        app()->singleton('prefix', fn() => $allowedPrefixes);

        return $next($request);
    }
}
