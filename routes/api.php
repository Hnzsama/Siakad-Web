<?php

use App\Http\Controllers\Api\AttendanceController;
use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    $user = User::query()->where('id', $request->user()->id)->first();

    if ($user->hasRole('student')) {
        $user->load('student', 'roles');
    } else if ($user->hasRole('teacher')) {
        $user->load('teacher', 'roles');
    }
    return $user;
})->middleware('auth:sanctum');

Route::apiResource('attendances', AttendanceController::class)->middleware('auth:sanctum');

Route::get('currentWib', function () {
    return Carbon::now()->setTimezone('Asia/Jakarta')->format('Y-m-d H:i:s');
});

Route::get('/import-status', function (Request $request) {
    $status = DB::table('import_statuses')
        ->where('user_id', $request->user()->id)
        ->where('is_done', false)
        ->where('import_type', 'student')
        ->latest()
        ->first();

    if ($status) {
        // Update is_done menjadi true
        DB::table('import_statuses')
            ->where('id', $status->id)
            ->update(['is_done' => true]);

        // Kembalikan data status dalam format JSON
        return response()->json([
            'success' => true,
            'message' => 'Status ditemukan',
            'data' => $status,
        ]);
    }

    // Jika tidak ada status yang ditemukan
    return response()->json([
        'success' => false,
        'message' => 'Tidak ditemukan impor baru-baru ini',
    ]);
});

Route::get('try', AttendanceController::class . '@store');


require __DIR__ . '/authApi.php';
