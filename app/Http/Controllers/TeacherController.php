<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Http\Requests\StoreTeacherRequest;
use App\Http\Requests\UpdateTeacherRequest;
use App\Models\Agency;
use App\Models\Attendance;
use App\Models\ClassSubject;
use App\Models\LeaveRequest;
use App\Models\Student;
use App\Models\SubjectTeacher;
use App\Models\User;
use App\Service\ShiftService;
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

class TeacherController extends Controller
{
    use AuthorizesRequests;

    protected $userService;
    protected $shiftService;

    public function __construct(
        UserService $userService,
        ShiftService $shiftService
    ) {
        $this->userService = $userService;
        $this->shiftService = $shiftService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('view_any_teacher');
        $shifts = $this->shiftService->getAllShift();
        $teachers = Teacher::with([
            'user',
            'shift',
            'homeroomTeacher',
            'homeroomTeacher.classLevel',
            'homeroomTeacher.major',
            'homeroomTeacher.studyGroup',
            'homeroomTeacher.shift',
        ])->get()
            ->map(function ($teacher) {
                $data = $teacher->toArray();

                if ($teacher->homeroomTeacher && $teacher->homeroomTeacher->classLevel) {
                    $name = $teacher->homeroomTeacher->classLevel->alphabet;

                    if ($teacher->homeroomTeacher->major) {
                        $initials = preg_match_all('/\b\w/u', $teacher->homeroomTeacher->major->name, $matches);
                        $majorInitials = $initials ? strtoupper(implode('', $matches[0])) : '';
                        $name .= ' ' . $majorInitials;
                    }

                    if ($teacher->homeroomTeacher->studyGroup) {
                        $name .= ' ' . $teacher->homeroomTeacher->studyGroup->name;
                    }

                    $data['homeroom_teacher']['name'] = $name;
                }

                return $data;
            });
        return Inertia::render('teachers/index', compact([
            'teachers',
            'shifts'
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
    public function store(StoreTeacherRequest $request)
    {
        $this->authorize('create_teacher');
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $user = $this->userService->generateUser('teacher', $validatedData['name'], $validatedData['email'], $validatedData['phone'], $validatedData['date_of_birth']);

            $validatedData['user_id'] = $user->id;

            $teacher = Teacher::create($validatedData);

            DB::commit();

            return redirect()
                ->route('teachers.index')
                ->with('success', 'Guru berhasil dibuat');
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
        $this->authorize('view_teacher');
        try {
            $user = Auth::user();
            assert($user instanceof User);

            if ($user->hasRole('guardian')) {
                $students = Student::with([
                    'classroom.homeroomTeacher.user',
                    'classroom.classLevel',
                    'classroom.major',
                    'classroom.studyGroup',
                ])->where('guardian_id', $id)->get()
                    ->map(function ($student) {
                        $data = $student->toArray();

                        if ($student->classroom) {
                            // Generate classroom name
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

                $teacherIds = $students->pluck('classroom.homeroom_teacher.id')
                    ->filter()
                    ->unique();

                $teachers = Teacher::with([
                    'user:id,name,email,phone',
                    'homeroomTeacher.classLevel',
                    'homeroomTeacher.major',
                    'homeroomTeacher.studyGroup',
                ])
                    ->whereIn('id', $teacherIds)
                    ->get()
                    ->map(function ($teacher) {
                        $data = $teacher->toArray();

                        if ($teacher->homeroomTeacher) {
                            // Generate homeroom class name
                            $name = $teacher->homeroomTeacher->classLevel->alphabet;

                            if ($teacher->homeroomTeacher->major) {
                                $majorNameParts = explode(' ', $teacher->homeroomTeacher->major->name);
                                $initials = strtoupper(substr($majorNameParts[0], 0, 1) . substr($majorNameParts[1] ?? '', 0, 1));
                                if ($initials === 'TI') {
                                    $initials .= strtoupper(substr($majorNameParts[1] ?? '', 1, 1));
                                }
                                $name .= ' ' . $initials;
                            }

                            if ($teacher->homeroomTeacher->studyGroup) {
                                $name .= ' ' . $teacher->homeroomTeacher->studyGroup->name;
                            }

                            $data['homeroom_teacher']['name'] = $name;
                        }

                        return $data;
                    });

                return Inertia::render('teachers/show', [
                    'teachers' => $teachers,
                    'students' => $students
                ]);
            } else {
                $teacher = Teacher::with([
                    'user',
                    'shift',
                    'homeroomTeacher.classLevel',
                    'homeroomTeacher.major',
                    'homeroomTeacher.studyGroup',
                    'subjects',
                    'classSubjects.classroom',
                    'attendances'
                ])->findOrFail($id);

                $data = $teacher->toArray();

                if ($teacher->homeroomTeacher) {
                    // Generate homeroom class name
                    $name = $teacher->homeroomTeacher->classLevel->alphabet;

                    if ($teacher->homeroomTeacher->major) {
                        $majorNameParts = explode(' ', $teacher->homeroomTeacher->major->name);
                        $initials = strtoupper(substr($majorNameParts[0], 0, 1) . substr($majorNameParts[1] ?? '', 0, 1));
                        if ($initials === 'TI') {
                            $initials .= strtoupper(substr($majorNameParts[1] ?? '', 1, 1));
                        }
                        $name .= ' ' . $initials;
                    }

                    if ($teacher->homeroomTeacher->studyGroup) {
                        $name .= ' ' . $teacher->homeroomTeacher->studyGroup->name;
                    }

                    $data['homeroom_teacher']['name'] = $name;
                }
                return Inertia::render('teachers/show', [
                    'teacher' => $teacher
                ]);
            }
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Guru tidak ditemukan'
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
    public function edit(Teacher $teacher)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTeacherRequest $request, Teacher $teacher)
    {
        $this->authorize('update_teacher');
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $teacher->update($validatedData);

            DB::commit();

            return redirect()
                ->route('teachers.index')
                ->with('success', 'Guru berhasil diperbarui');
        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui guru']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Teacher $teacher)
    {
        $this->authorize('delete_teacher');
        try {
            $teacher = Teacher::with('homeroomTeacher')->findOrFail($teacher->id);

            DB::beginTransaction();
            try {
                // Set classroom's teacher_id to null if teacher is a homeroom teacher
                if ($teacher->homeroomTeacher) {
                    $teacher->homeroomTeacher->update(['teacher_id' => null]);
                }

                // Delete related data
                Agency::where('agencyable_id', $teacher->id)->delete();

                // Delete subject teachers and related class subjects
                $subjectTeacherIds = SubjectTeacher::where('teacher_id', $teacher->id)
                    ->pluck('id');
                ClassSubject::whereIn('subject_teacher_id', $subjectTeacherIds)->delete();
                SubjectTeacher::where('teacher_id', $teacher->id)->delete();

                // Delete attendances and leave requests
                Attendance::where('attendable_id', $teacher->id)->delete();
                LeaveRequest::where('leavable_id', $teacher->id)->delete();

                // Delete teacher and user
                $user = User::findOrFail($teacher->user_id);
                $teacher->delete();
                $user->delete();

                DB::commit();

                return redirect()
                    ->route('teachers.index')
                    ->with('success', 'Guru berhasil dihapus');
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Guru tidak ditemukan'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }

    public function bulkDestroy(Request $request)
    {
        $this->authorize('delete_teacher');
        try {
            $request->validate([
                'ids' => ['required', 'array'],
                'ids.*' => ['required', 'uuid', Rule::exists(Teacher::class, 'id')],
            ]);

            DB::beginTransaction();
            try {
                $teachers = Teacher::whereIn('id', $request->ids)->with('homeroomTeacher')->get();

                foreach ($teachers as $teacher) {
                    // Set classroom's teacher_id to null if teacher is a homeroom teacher
                    if ($teacher->homeroomTeacher) {
                        $teacher->homeroomTeacher->update(['teacher_id' => null]);
                    }
                }

                $userIds = $teachers->pluck('user_id');

                // Delete related data
                Agency::whereIn('agencyable_id', $userIds)->delete();

                // Delete subject teachers and related class subjects
                $subjectTeacherIds = SubjectTeacher::whereIn('teacher_id', $request->ids)
                    ->pluck('id');
                ClassSubject::whereIn('subject_teacher_id', $subjectTeacherIds)->delete();
                SubjectTeacher::whereIn('teacher_id', $request->ids)->delete();

                // Delete attendances and leave requests
                Attendance::whereIn('attendable_id', $userIds)->delete();
                LeaveRequest::whereIn('leavable_id', $userIds)->delete();

                // Delete teachers and users
                Teacher::whereIn('id', $request->ids)->delete();
                User::whereIn('id', $userIds)->delete();

                DB::commit();

                return redirect()
                    ->route('teachers.index')
                    ->with('success', count($request->ids) . ' Guru berhasil dihapus');
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Guru yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
