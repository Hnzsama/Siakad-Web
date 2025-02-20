<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AttendanceSettingController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::get('settings', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('settings/{id}', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('settings/school/{id}', [ProfileController::class, 'updateSchool'])->name('profile.school.update');

    Route::prefix('settings')->group(function () {
        Route::get('account', [AccountController::class, 'edit'])->name('account.edit');
        Route::patch('account', [AccountController::class, 'update'])->name('account.update');
        Route::delete('account', [AccountController::class, 'destroy'])->name('account.destroy');

        Route::resource('attendanceSetting', AttendanceSettingController::class)->only(['index', 'update']);

        Route::get('appearance', function () {
            return Inertia::render('settings/appearance/index');
        })->name('appearance');

        Route::get('display', function () {
            return Inertia::render('settings/display/index');
        })->name('display');

        Route::get('notifications', function () {
            return Inertia::render('settings/notifications/index');
        })->name('notifications');
    });

});
