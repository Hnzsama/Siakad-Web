<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\Agency;
use App\Models\Attendance;
use App\Models\Guardian;
use App\Models\LeaveRequest;
use App\Models\Semester;
use App\Models\StudentHistory;
use App\Models\User;
use App\Models\Violation;
use App\Models\WarningLetter;
use App\Service\ClassroomService;
use App\Service\GuardianService;
use App\Service\SemesterService;
use App\Service\UserService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class StudentController extends Controller
{
    use AuthorizesRequests;

    protected $classroomService;
    protected $userService;
    protected $semesterService;
    protected $guardianService;

    public function __construct(
        ClassroomService $classroomService,
        UserService $userService,
        SemesterService $semesterService,
        GuardianService $guardianService,
    ) {
        // $this->authorizeResource(Student::class, 'student');
        $this->classroomService = $classroomService;
        $this->userService = $userService;
        $this->semesterService = $semesterService;
        $this->guardianService = $guardianService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('view_any_student', Student::class);
        $user = Auth::user();
        assert($user instanceof User);

        $classrooms = $this->classroomService->getAllClassrooms();
        $semesters = $this->semesterService->getAllSemester();
        $guadians = $this->guardianService->getAllGuardian();

        $query = Student::with([
            'user',
            'classroom.classLevel',
            'classroom.major',
            'classroom.studyGroup',
            'classroom.shift',
            'classroom.homeroomTeacher',
            'guardian',
            'semester'
        ]);

        if ($user->hasRole('teacher')) {
            $query->whereHas('classroom', function ($query) use ($user) {
                $query->where('teacher_id', $user->teacher->id);
            });
        }

        $students = $query->get()
            ->map(function ($student) {
                $data = $student->toArray();

                if ($student->classroom) {
                    $name = $student->classroom->classLevel->alphabet;
                    if ($student->classroom->major) {
                        $initials = preg_match_all('/\b\w/u', $student->classroom->major->name, $matches);
                        $majorInitials = $initials ? strtoupper(implode('', $matches[0])) : '';
                        $name .= ' ' . $majorInitials;
                    }
                    if ($student->classroom->studyGroup) {
                        $name .= ' ' . $student->classroom->studyGroup->name;
                    }
                    $data['classroom']['name'] = $name;
                }

                return $data;
            });

        return Inertia::render('students/index', [
            'students' => $students,
            'classrooms' => $classrooms,
            'semesters' => $semesters,
            'guardians' => $guadians
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
    public function store(StoreStudentRequest $request)
    {
        $this->authorize('create_student');
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $user = $this->userService->generateUser('student', $validatedData['name'], $validatedData['email'], $validatedData['phone'], $validatedData['date_of_birth']);

            $validatedData['user_id'] = $user->id;

            if ($validatedData['semester_id'] == null) {
                $semester = Semester::where('status', 'active')->first();
                $validatedData['semester_id'] = $semester->id;
            }

            $student = Student::create($validatedData);

            DB::commit();

            return redirect()
                ->route('students.index')
                ->with('success', 'Siswa berhasil dibuat');
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
    public function show(String $id)
    {
        $this->authorize('view_student');
        try {
            $user = Auth::user();
            assert($user instanceof User);

            if ($user->hasRole('guardian')) {
                $query = Student::with([
                    'classroom.homeroomTeacher.user',
                    'classroom.classLevel',
                    'classroom.major',
                    'classroom.studyGroup',
                    'warningLetters',
                    'leaveRequests',
                    'violations',
                    'attendances'
                ]);
                $students = $query->where('guardian_id', $id)->get()
                    ->map(function ($student) {
                        $data = $student->toArray();

                        if ($student->classroom) {
                            $name = $student->classroom->classLevel->alphabet;

                            if ($student->classroom->major) {
                                $majorNameParts = explode(' ', $student->classroom->major->name);
                                $initials = strtoupper(substr($majorNameParts[0], 0, 1) . substr($majorNameParts[1] ?? '', 0, 1));
                                if ($initials === 'TI') {
                                    $initials .= strtoupper(substr($majorNameParts[1] ?? '', 1, 1));
                                }
                                $name .= ' ' . $initials;
                            }

                            if ($student->classroom->studyGroup) {
                                $name .= ' ' . $student->classroom->studyGroup->name;
                            }

                            $data['classroom']['name'] = $name;
                        }

                        return $data;
                    });

                return Inertia::render('students/show', [
                    'students' => $students
                ]);
            } else {
                $query = Student::with([
                    'classroom.homeroomTeacher.user',
                    'classroom.classLevel',
                    'classroom.major',
                    'classroom.studyGroup',
                    'guardian',
                    'warningLetters',
                    'leaveRequests',
                    'violations',
                    'attendances'
                ]);
                $student = $query->findOrFail($id);
                $data = $student->toArray();

                if ($student->classroom) {
                    $name = $student->classroom->classLevel->alphabet;

                    if ($student->classroom->major) {
                        $majorNameParts = explode(' ', $student->classroom->major->name);
                        $initials = strtoupper(substr($majorNameParts[0], 0, 1) . substr($majorNameParts[1] ?? '', 0, 1));
                        if ($initials === 'TI') {
                            $initials .= strtoupper(substr($majorNameParts[1] ?? '', 1, 1));
                        }
                        $name .= ' ' . $initials;
                    }

                    if ($student->classroom->studyGroup) {
                        $name .= ' ' . $student->classroom->studyGroup->name;
                    }

                    $data['classroom']['name'] = $name;
                }

                return Inertia::render('students/show', [
                    'student' => $data
                ]);
            }
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Siswa tidak ditemukan'
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
    public function edit(Student $student)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentRequest $request, Student $student)
    {
        $this->authorize('update_student');
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $student->update($validatedData);

            DB::commit();

            return redirect()
                ->route('students.index')
                ->with('success', 'Siswa berhasil diperbarui');
        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui Siswa']);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function destroy(Student $student)
    {
        $this->authorize('delete_student');
        try {
            DB::beginTransaction();

            $studentHistories = StudentHistory::where('student_id', $student->id);
            $agencies = Agency::where('agencyable_id', $student->id);
            $attendances = Attendance::where('attendable_id', $student->id);
            $warningLetters = WarningLetter::where('student_id', $student->id);
            $leaveRequests = LeaveRequest::where('leavable_id', $student->id);
            $violations = Violation::where('student_id', $student->id);
            $user = User::findOrFail($student->user_id);
            $studentHistories->delete();
            $agencies->delete();
            $attendances->delete();
            $warningLetters->delete();
            $leaveRequests->delete();
            $violations->delete();
            $student->delete();
            $user->delete();

            DB::commit();

            return redirect()
                ->route('students.index')
                ->with('success', 'Siswa berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return back()->withErrors([
                'error' => 'Siswa tidak ditemukan'
            ])->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }

    public function bulkDestroy(Request $request)
    {
        $this->authorize('delete_student');
        try {
            $request->validate([
                'ids' => ['required', 'array'],
                'ids.*' => ['required', 'uuid', Rule::exists(Student::class, 'id')],
            ]);

            DB::beginTransaction();

            $students = Student::whereIn('id', $request->ids);
            $users = User::whereIn('id', $students->pluck('user_id'));
            $studentHistories = StudentHistory::whereIn('student_id', $students->pluck('id'));
            $agencies = Agency::whereIn('agencyable_id', $students->pluck('id'));
            $attendances = Attendance::whereIn('attendable_id', $students->pluck('id'));
            $warningLetters = WarningLetter::whereIn('student_id', $students->pluck('id'));
            $leaveRequests = LeaveRequest::whereIn('leavable_id', $students->pluck('id'));
            $violations = Violation::whereIn('student_id', $students->pluck('id'));

            $studentHistories->delete();
            $agencies->delete();
            $attendances->delete();
            $warningLetters->delete();
            $leaveRequests->delete();
            $violations->delete();
            $violations->delete();
            $students->delete();
            $users->delete();

            DB::commit();

            return redirect()
                ->route('students.index')
                ->with('success', count($request->ids) . 'Siswa berhasil dihapus');
        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors([
                'error' => 'Siswa yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
