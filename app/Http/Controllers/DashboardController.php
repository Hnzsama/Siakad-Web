<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Teacher;
use App\Models\Guardian;
use App\Models\User;
use App\Models\Classroom;
use App\Service\ClassroomService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Violation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    protected $classroomService;

    public function __construct(ClassroomService $classroomService)
    {
        $this->classroomService = $classroomService;
    }

    protected function getStudentData($student)
    {
        $monday = now()->startOfWeek();
        $sunday = now()->endOfWeek();

        // Debug lebih detail
        Log::info('Student Info', [
            'id' => $student->id,
            'name' => $student->name,
            'raw_violations' => $student->violations()->where('status', 'approved')->get(),
            'raw_leave_requests' => $student->leaveRequests()->where('status', 'Approved')->get(),
        ]);

        // Load relasi dengan eager loading yang lebih spesifik
        $student->load([
            'classroom',
            'warningLetters' => function($query) {
                $query->with('warningCategory')
                      ->where('status', 'approved')
                      ->orderBy('created_at', 'desc');
            },
            'violations' => function($query) {
                $query->with('violationType')
                      ->where('status', 'approved')
                      ->orderBy('created_at', 'desc');
            },
            'leaveRequests' => function($query) {
                $query->with(['leaveType' => function($q) {
                    $q->select('id', 'leave_name');
                }])
                ->whereIn('status', ['Approved', 'Rejected']) // Menerima kedua status
                ->orderBy('created_at', 'desc');
            }
        ]);

        // Debug data setelah load
        Log::info('Loaded Relations', [
            'violations_count' => $student->violations->count(),
            'leave_requests_count' => $student->leaveRequests->count(),
            'violations' => $student->violations->toArray(),
            'leave_requests' => $student->leaveRequests->toArray(),
        ]);

        // Debug khusus untuk leave requests
        Log::info('Leave Requests Debug', [
            'raw_leave_requests' => $student->leaveRequests()->with('leaveType')->get()->toArray(),
            'loaded_leave_requests' => $student->leaveRequests->toArray()
        ]);

        return [
            'name' => $student->name,
            'nis' => $student->nis,
            'classroom' => $student->classroom ? $this->classroomService->formatClassroomName($student->classroom) : '-',
            'remaining_points' => $student->violation_points,
            'attendances' => $student->attendances()
                ->whereBetween('date', [$monday, $sunday])
                ->orderBy('date', 'desc')
                ->get()
                ->map(function ($attendance) {
                    return [
                        'id' => $attendance->id,
                        'date' => $attendance->date->format('d M Y'),
                        'time' => $attendance->time->format('H:i'),
                        'status' => $attendance->status,
                    ];
                }),
            'warning_letters' => $student->warningLetters
                ->filter(function ($letter) {
                    return $letter->warningCategory !== null && $letter->status === 'approved';
                })
                ->map(function ($letter) {
                    return [
                        'id' => $letter->id,
                        'level' => $letter->level,
                        'name' => $letter->warningCategory->name,
                        'description' => $letter->description,
                        'date' => $letter->created_at->format('d M Y'),
                    ];
                })->values(),
            'violations' => $student->violations
                ->map(function ($violation) {
                    Log::info('Mapping Violation', ['violation' => $violation->toArray()]);
                    return [
                        'id' => $violation->id,
                        'name' => $violation->violationType->name ?? 'Unnamed Violation',
                        'description' => $violation->description,
                        'points' => $violation->points,
                        'date' => $violation->created_at->format('d M Y'),
                    ];
                })->values(),
            'leave_requests' => $student->leaveRequests
                ->map(function ($leave) {
                    Log::info('Processing Leave Request', [
                        'leave_id' => $leave->id,
                        'leave_type' => $leave->leaveType,
                        'status' => $leave->status
                    ]);
                    
                    return [
                        'id' => $leave->id,
                        'type' => $leave->leaveType ? $leave->leaveType->leave_name : 'Unknown Type',
                        'description' => $leave->reason, // menggunakan reason dari schema
                        'status' => $leave->status, // Akan menampilkan 'Approved' atau 'Rejected'
                        'start_date' => $leave->start_date,
                        'end_date' => $leave->end_date,
                    ];
                })->values(),
        ];
    }

    public function index()
    {
        $user = Auth::user();
        assert($user instanceof User);

        if ($user->hasRole('student')) {
            $student = $user->student;
            return Inertia::render('dashboard/index', [
                'studentData' => $this->getStudentData($student),
            ]);
        }

        if ($user->hasRole('guardian')) {
            $guardian = $user->guardian;
            
            if (!$guardian) {
                return Inertia::render('dashboard/index', [
                    'childrenData' => [],
                ]);
            }

            // Load relasi children (bukan students)
            $guardian->load('children.classroom', 'children.warningLetters', 'children.violations', 'children.leaveRequests');
            
            $childrenData = collect($guardian->children)->map(function ($child) {
                return [
                    'id' => $child->id,
                    'name' => $child->name,
                    'nis' => $child->nis,
                    'classroom' => $child->classroom ? $this->classroomService->formatClassroomName($child->classroom) : '-',
                    'remaining_points' => $child->violation_points,
                    'warning_letters' => $child->warningLetters->map(function ($letter) {
                        return [
                            'id' => $letter->id,
                            'level' => $letter->level,
                            'date' => $letter->created_at->format('d M Y'),
                        ];
                    })->values(),
                    'violations' => $child->violations->map(function ($violation) {
                        return [
                            'id' => $violation->id,
                            'name' => $violation->name,
                            'points' => $violation->points,
                            'date' => $violation->created_at->format('d M Y'),
                        ];
                    })->values(),
                    'leave_requests' => $child->leaveRequests->map(function ($leave) {
                        return [
                            'id' => $leave->id,
                            'type' => $leave->type,
                            'status' => $leave->status,
                            'start_date' => \Carbon\Carbon::parse($leave->start_date)->format('d M Y'),
                            'end_date' => \Carbon\Carbon::parse($leave->end_date)->format('d M Y'),
                        ];
                    })->values(),
                ];
            })->values();

            return Inertia::render('dashboard/index', [
                'childrenData' => $childrenData,
            ]);
        }

        if ($user->hasRole('teacher')) {
            $teacher = $user->teacher;
            $isHomeroom = $teacher->homeroomTeacher()->exists();
            
            $studentsPerClass = $isHomeroom 
                ? [
                    [
                        'id' => $teacher->classroom->id,
                        'name' => $this->classroomService->formatClassroomName($teacher->classroom),
                        'total' => $teacher->classroom->students()->count(),
                    ]
                ]
                : [];

            return Inertia::render('dashboard/index', [
                'studentsPerClass' => $studentsPerClass,
                'isHomeroom' => $isHomeroom,
            ]);
        }

        $totalStudents = Student::count();
        $totalTeachers = Teacher::count();
        $totalGuardians = Guardian::count();
        $totalUsers = User::count();

        // Get students per classroom with proper name generation
        $studentsPerClass = Classroom::with(['classLevel', 'major', 'studyGroup'])
            ->withCount('students')
            ->get()
            ->map(function ($classroom) {
                return [
                    'id' => $classroom->id,
                    'name' => $this->classroomService->formatClassroomName($classroom),
                    'total' => $classroom->students_count
                ];
            })
            ->sortBy('name')
            ->values();

        // Get top 5 students with lowest violation points
        $topViolators = Student::with(['classroom'])
            ->where('violation_points', '<', 100)
            ->orderBy('violation_points', 'desc')
            ->take(5)
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'nis' => $student->nis,
                    'classroom' => $student->classroom ? $this->classroomService->formatClassroomName($student->classroom) : '-',
                    'remaining_points' => $student->violation_points,
                    'deducted_points' => $student->violation_points
                ];
            })
            ->values();

        return Inertia::render('dashboard/index', [
            'totalStudents' => $totalStudents,
            'totalTeachers' => $totalTeachers,
            'totalGuardians' => $totalGuardians,
            'totalUsers' => $totalUsers,
            'studentsPerClass' => $studentsPerClass,
            'topViolators' => $topViolators,
        ]);
    }
}
