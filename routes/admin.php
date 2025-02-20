<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AgencyController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ClassLevelController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\ClassSubjectController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GuardianController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\LeaveTypeController;
use App\Http\Controllers\MajorController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentHistoryController;
use App\Http\Controllers\StudentImportController;
use App\Http\Controllers\StudyGroupController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\SubjectTeacherController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ViolationController;
use App\Http\Controllers\ViolationTypeController;
use App\Http\Controllers\WarningCategoryController;
use App\Http\Controllers\WarningLetterController;
use Egulias\EmailValidator\Warning\Warning;
use Inertia\Inertia;

Route::prefix('admin')->middleware('auth')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->middleware('verified')->name('dashboard');

    Route::resource('roles', RoleController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::post('roles/bulkDestroy', [RoleController::class, 'bulkDestroy'])->name('roles.bulkDestroy');

    Route::resource('schools', SchoolController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::post('schools/bulkDestroy', [SchoolController::class, 'bulkDestroy'])->name('schools.bulkDestroy');

    Route::resource('users', UserController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::post('users/bulkDestroy', [UserController::class, 'bulkDestroy'])->name('users.bulkDestroy');

    Route::resource('semesters', SemesterController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::post('semesters/bulkDestroy', [SemesterController::class, 'bulkDestroy'])->name('semesters.bulkDestroy');

    Route::resource('teachers', TeacherController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::post('teachers/bulkDestroy', [TeacherController::class, 'bulkDestroy'])->name('teachers.bulkDestroy');

    Route::resource('guardians', GuardianController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::post('guardians/bulkDestroy', [GuardianController::class, 'bulkDestroy'])->name('guardians.bulkDestroy');

    Route::resource('majors', MajorController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::post('majors/bulkDestroy', [MajorController::class, 'bulkDestroy'])->name('majors.bulkDestroy');

    Route::resource('shifts', ShiftController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::post('shifts/bulkDestroy', [ShiftController::class, 'bulkDestroy'])->name('shifts.bulkDestroy');

    Route::resource('studyGroups', StudyGroupController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::post('studyGroups/bulkDestroy', [StudyGroupController::class, 'bulkDestroy'])->name('studyGroups.bulkDestroy');

    Route::resource('classLevels', ClassLevelController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::post('classLevels/bulkDestroy', [ClassLevelController::class, 'bulkDestroy'])->name('classLevels.bulkDestroy');

    Route::resource('classrooms', ClassroomController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::post('classrooms/bulkDestroy', [ClassroomController::class, 'bulkDestroy'])->name('classrooms.bulkDestroy');

    Route::resource('subjects', SubjectController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::post('subjects/bulkDestroy', [SubjectController::class, 'bulkDestroy'])->name('subjects.bulkDestroy');

    Route::resource('students', StudentController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::post('/students/import', StudentImportController::class)->name('students.import');
    Route::post('students/bulkDestroy', [StudentController::class, 'bulkDestroy'])->name('students.bulkDestroy');

    // Route::resource('studentHistories', StudentHistoryController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    // Route::post('studentHistories/bulkDestroy', [StudentHistoryController::class, 'bulkDestroy'])->name('studentHistories.bulkDestroy');

    Route::resource('agencies', AgencyController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::post('agencies/bulkDestroy', [AgencyController::class, 'bulkDestroy'])->name('agencies.bulkDestroy');

    Route::resource('subjectTeachers', SubjectTeacherController::class)->only(['index', 'create', 'store', 'show', 'update', 'destroy']);
    Route::post('subjectTeachers/bulkDestroy', [SubjectTeacherController::class, 'bulkDestroy'])->name('subjectTeachers.bulkDestroy');

    Route::resource('classSubjects', ClassSubjectController::class);
    Route::post('classSubjects/bulkDestroy', [ClassSubjectController::class, 'bulkDestroy'])->name('classSubjects.bulkDestroy');
    Route::post('classSubjects/bulkUpdate', [ClassSubjectController::class, 'bulkUpdate'])->name('classSubjects.bulkUpdate');

    Route::resource('schedules', ScheduleController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::post('schedules/bulkDestroy', [ScheduleController::class, 'bulkDestroy'])->name('schedules.bulkDestroy');

    Route::resource('attendances', AttendanceController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::post('attendances/bulkDestroy', [AttendanceController::class, 'bulkDestroy'])->name('attendances.bulkDestroy');
    Route::get('attendances/classroom/monthly', [AttendanceController::class, 'classroomMonthly'])->name('attendances.classroomMonthly');
    Route::get('attendances/monthly/{year}', [AttendanceController::class, 'monthly'])->name('attendances.monthly');

    Route::resource('warningCategories', WarningCategoryController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::post('warningCategories/bulkDestroy', [WarningCategoryController::class, 'bulkDestroy'])->name('warningCategories.bulkDestroy');

    Route::resource('warningLetters', WarningLetterController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::post('warningLetters/{warningLetter}/receive', [WarningLetterController::class, 'receive'])->name('warningLetters.receive');
    Route::put('warningLetters/{warningLetter}/approve', [WarningLetterController::class, 'approve'])->name('warningLetters.approve');
    Route::put('warningLetters/{warningLetter}/cancel', [WarningLetterController::class, 'cancel'])->name('warningLetters.cancel');
    Route::post('warningLetters/bulkDestroy', [WarningLetterController::class, 'bulkDestroy'])->name('warningLetters.bulkDestroy');

    Route::resource('leaveTypes', LeaveTypeController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::post('leaveTypes/bulkDestroy', [LeaveTypeController::class, 'bulkDestroy'])->name('leaveTypes.bulkDestroy');

    Route::resource('leaveRequests', LeaveRequestController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::put('leaveRequests/{leaveRequest}/approve', [LeaveRequestController::class, 'approve'])->name('leaveRequests.approve');
    Route::put('leaveRequests/{leaveRequest}/reject', [LeaveRequestController::class, 'reject'])->name('leaveRequests.reject');
    Route::post('leaveRequests/bulkDestroy', [LeaveRequestController::class, 'bulkDestroy'])->name('leaveRequests.bulkDestroy');

    Route::resource('violationTypes', ViolationTypeController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::post('violationTypes/bulkDestroy', [ViolationTypeController::class, 'bulkDestroy'])->name('violationTypes.bulkDestroy');

    Route::resource('violations', ViolationController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::put('violations/{violation}/approve', [ViolationController::class, 'approve'])->name('violations.approve');
    Route::put('violations/{violation}/cancel', [ViolationController::class, 'cancel'])->name('violations.cancel');
    Route::post('violations/bulkDestroy', [ViolationController::class, 'bulkDestroy'])->name('violations.bulkDestroy');

    Route::resource('announcements', AnnouncementController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
    Route::post('announcements/bulkDestroy', [AnnouncementController::class, 'bulkDestroy'])->name('announcements.bulkDestroy');
});
