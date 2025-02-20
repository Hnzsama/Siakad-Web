<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        $request->validate([
            'device_name' => ['required', 'string'],
        ]);

        $user = $request->user();

        // Strict check untuk role
        if (!$user->hasAnyRole(['teacher', 'student'])) {
            return response()->json([
                'message' => 'Hanya siswa dan guru yang diizinkan.',
            ], 403);
        }

        if ($user->is_locked) {
            return response()->json([
                'message' => 'Akun terkunci, Silakan hubungi admin.',
                'locked_reason' => $user->locked_reason,
                'locked_at' => $user->locked_at,
                'is_locked' => true
            ], 403);
        }

        // Cek apakah user sudah memiliki token untuk device yang sama
        $existingToken = $user->tokens()
            ->where('name', $request->device_name)
            ->first();

        // Jika sudah ada token untuk device tersebut
        if ($existingToken) {
            return response()->json([
                'message' => 'Akun ini sudah login di perangkat yang sama.',
                'device_name' => $request->device_name
            ], 403);
        }

        // Cek apakah user sudah memiliki token di device lain
        $otherDeviceToken = $user->tokens()
            ->where('name', '!=', $request->device_name)
            ->first();

        if ($otherDeviceToken) {
            return response()->json([
                'message' => 'Akun ini sudah login di perangkat lain.',
                'device_name' => $otherDeviceToken->name
            ], 403);
        }

        // Jika belum ada token, buat token baru
        return response()->json([
            'token' => $user->createToken($request->device_name)->plainTextToken,
            'role' => $user->getRoleNames()
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        $user = $request->user();

        // $user->update([
        //     'is_locked' => true,
        //     'locked_reason' => 'Logout dari perangkat',
        //     'locked_at' => now()
        // ]);

        $user->currentAccessToken()->delete();

        return response()->noContent();
    }
}
