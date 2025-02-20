<?php

use App\Http\Controllers\AttendanceController;
use App\Models\Agency;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\Role;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use App\Models\WarningLetter;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/setting.php';
