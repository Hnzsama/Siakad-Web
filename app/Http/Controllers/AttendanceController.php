<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Http\Requests\StoreAttendanceRequest;
use App\Http\Requests\UpdateAttendanceRequest;
use App\Models\Classroom;
use App\Models\Schedule;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use App\Service\ClassroomService;
use App\Service\StudentService;
use App\Service\TeacherService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    use AuthorizesRequests;

    protected $teacherService;
    protected $studentService;
    protected $classroomService;

    public function __construct(
        TeacherService $teacherService,
        StudentService $studentService,
        ClassroomService $classroomService
    ) {
        $this->authorizeResource(Attendance::class, 'attendance');
        $this->teacherService = $teacherService;
        $this->studentService = $studentService;
        $this->classroomService = $classroomService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        assert($user instanceof User);

        $teachers = $this->teacherService->getAllTeacher();
        $students = $this->studentService->getAllStudent();

        $query = Attendance::with(['attendable', 'semester'])->limit(5000);

        if ($user->hasRole('teacher')) {
            $query->where('attendable_id', $user->teacher->id);
        }

        $attendances = $query->get();
        return Inertia::render('attendances/index', compact([
            'attendances',
            'teachers',
            'students'
        ]));
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
    public function store(StoreAttendanceRequest $request)
    {
        try {
            $validatedData = $request->validated();

            $user = Auth::user();
            assert($user instanceof User);

            DB::beginTransaction();

            $semester = Semester::query()->where('status', 'active')->first();

            $validatedData['semester_id'] = $semester->id;

            if ($user->hasRole('teacher')) {
                $schedule = Schedule::query()->where('shift_id', $user->teacher->shift_id);
            } else if ($user->hasRole('student')) {
                $schedule = Schedule::query()->where('shift_id', $user->student->classroom->shift_id);
            }

            $attendance = Attendance::create($validatedData);

            DB::commit();

            return redirect()
                ->route('attendances.index')
                ->with('success', 'Absensi berhasil dibuat');
        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Attendance $attendance)
    {
        try {
            return inertia('attendances/show', [
                'attendance' => $attendance
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Absensi tidak ditemukan'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attendance $attendance)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttendanceRequest $request, Attendance $attendance)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $attendance->update($validatedData);

            DB::commit();

            return to_route('attendances.index');
        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui Absensi']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendance $attendance)
    {
        try {
            $attendance->delete();
            return redirect()
                ->route('attendances.index')
                ->with('success', 'Absensi berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Absensi tidak ditemukan'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }

    public function bulkDestroy(Request $request)
    {
        try {
            $request->validate([
                'ids' => ['required', 'array'],
                'ids.*' => ['required', 'uuid', Rule::exists(Attendance::class, 'id')],
            ]);

            Attendance::whereIn('id', $request->ids)->delete();

            return redirect()
                ->route('attendances.index')
                ->with('success', count($request->ids) . 'Absensi berhasil dihapus');
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Absensi yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }

    public function classroomMonthly(?string $year = null, ?string $month = null)
    {
        try {
            $selectedYear = $year ?? date('Y');
            $selectedMonth = $month ?? date('m');

            // Ambil semua kehadiran berdasarkan tahun dan bulan yang dipilih
            $attendances = Attendance::query()
                ->whereYear('date', $selectedYear)
                ->whereMonth('date', $selectedMonth)
                ->where('attendable_type', Student::class) // Hanya ambil data siswa
                ->with(['attendable.classroom' => function ($query) {
                    // Load relasi classroom beserta relasi yang diperlukan untuk generate nama kelas
                    $query->with(['classLevel', 'major', 'studyGroup']);
                }])
                ->get();

            // Kelompokkan data berdasarkan kelas
            $groupedAttendances = $attendances->groupBy(function ($attendance) {
                // Generate nama kelas menggunakan relasi yang sudah di-load
                $classroom = $attendance->attendable->classroom;
                return $this->generateClassroomName($classroom);
            })->map(function ($classAttendances, $className) {
                $studentNames = $classAttendances->pluck('attendable.name')->unique()->values(); // Mengumpulkan nama siswa

                return [
                    'students' => $studentNames,
                    'attendances' => $classAttendances->groupBy(function ($attendance) {
                        // Gunakan nama siswa dari relasi attendable (Student)
                        return $attendance->attendable->name;
                    })->map(function ($studentAttendances) {
                        return $studentAttendances->map(function ($attendance) {
                            $records = [];
                            if ($attendance->check_in) {
                                $records[] = [
                                    'time' => substr($attendance->check_in, 0, 5),
                                    'type' => 'MASUK',
                                    'status' => $attendance->status
                                ];
                            }
                            if ($attendance->check_out) {
                                $records[] = [
                                    'time' => substr($attendance->check_out, 0, 5),
                                    'type' => 'PULANG',
                                    'status' => $attendance->status
                                ];
                            }
                            return [
                                'date' => $attendance->date,
                                'records' => $records
                            ];
                        })->groupBy(function ($item) {
                            return (int)date('d', strtotime($item['date']));
                        })->map(function ($dayAttendances) {
                            return $dayAttendances->flatMap(function ($attendance) {
                                return $attendance['records'];
                            })->sortBy(function ($record) {
                                return $record['type'] === 'PULANG' ? 1 : 0; // MASUK first
                            })->values()->all();
                        });
                    })
                ];
            });

            return response()->json($groupedAttendances);
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Absensi tidak ditemukan'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }

    /**
     * Generate nama kelas berdasarkan relasi classroom.
     */
    private function generateClassroomName($classroom)
    {
        $name = $classroom->classLevel->alphabet;

        if ($classroom->major) {
            $majorNameParts = explode(' ', $classroom->major->name);

            // Ambil huruf pertama dari setiap kata
            $initials = strtoupper(substr($majorNameParts[0], 0, 1) . substr($majorNameParts[1] ?? '', 0, 1));

            // Tambahkan huruf kedua jika bentrok
            if ($initials === 'TI') {
                $secondChar = substr($majorNameParts[1] ?? '', 1, 1);
                $initials .= strtoupper($secondChar);
            }

            $name .= ' ' . $initials;
        }

        if ($classroom->studyGroup) {
            $name .= ' ' . $classroom->studyGroup->name;
        }

        return $name;
    }

    public function monthly(?string $year = null)
    {
        try {
            $user = Auth::user();
            assert($user instanceof User);

            $selectedYear = $year ?? date('Y');
            $query = Attendance::query()->whereYear('date', $selectedYear); // Changed from created_at to date

            if ($user->hasRole('teacher')) {
                $query->where('attendable_id', $user->teacher->id)
                    ->where('attendable_type', Teacher::class);
            } else if ($user->hasRole('student')) {
                $query->where('attendable_id', $user->student->id)
                    ->where('attendable_type', Student::class);
            }

            $attendances = $query->get()
                ->map(function ($attendance) {
                    $records = [];

                    if ($attendance->check_in) {
                        $records[] = [
                            'time' => substr($attendance->check_in, 0, 5),
                            'type' => 'MASUK',
                            'status' => $attendance->status
                        ];
                    }

                    if ($attendance->check_out) {
                        $records[] = [
                            'time' => substr($attendance->check_out, 0, 5),
                            'type' => 'PULANG',
                            'status' => $attendance->status
                        ];
                    }

                    return [
                        'date' => $attendance->date,
                        'records' => $records
                    ];
                })
                ->groupBy(function ($item) {
                    return date('F', strtotime($item['date'])); // Returns English month names
                })
                ->map(function ($monthlyAttendances) {
                    return $monthlyAttendances->groupBy(function ($item) {
                        return (int)date('d', strtotime($item['date']));
                    })->map(function ($dayAttendances) {
                        // Gabungkan dan sort records (MASUK di atas, PULANG di bawah)
                        return $dayAttendances->flatMap(function ($attendance) {
                            return $attendance['records'];
                        })->sortBy(function ($record) {
                            return $record['type'] === 'PULANG' ? 1 : 0; // MASUK first
                        })->values()->all();
                    });
                });

            return Inertia::render('attendances/monthly', compact('attendances', 'year'));
            // return response()->json($attendances);/

        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Absensi tidak ditemukan'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
