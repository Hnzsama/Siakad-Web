<?php

namespace App\Http\Controllers;

use App\Models\ClassSubject;
use App\Http\Requests\StoreClassSubjectRequest;
use App\Http\Requests\UpdateClassSubjectRequest;
use App\Models\Classroom;
use App\Models\Schedule;
use App\Models\SubjectTeacher;
use App\Models\User;
use App\Service\ClassroomService;
use App\Service\SubjectService;
use App\Service\SubjectTeacherService;
use App\Service\TeacherService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Ramsey\Uuid\Uuid;

class ClassSubjectController extends Controller
{
    use AuthorizesRequests;
    protected $classroomService;
    protected $subjectTeacherService;
    protected $subjectService;
    protected $teacherService;

    public function __construct(
        ClassroomService $classroomService,
        SubjectTeacherService $subjectTeacherService,
        SubjectService $subjectService,
        TeacherService $teacherService
    ) {
        $this->classroomService = $classroomService;
        $this->subjectTeacherService = $subjectTeacherService;
        $this->subjectService = $subjectService;
        $this->teacherService = $teacherService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('view_any_class_subject');

        $user = Auth::user();
        assert($user instanceof User);

        $subjectTeachers = $this->subjectTeacherService->getAllSubjectTeacher();
        $subjects = $this->subjectService->getAllSubject();
        $teachers = $this->teacherService->getAllTeacher();
        $classrooms = $this->classroomService->getAllClassrooms();
        $query = ClassSubject::with([
            'subjectTeacher',
            'subjectTeacher.subject',
            'subjectTeacher.teacher',
            'classroom.classLevel',
            'classroom.major',
            'classroom.studyGroup',
            'classroom.shift',
            'classroom.homeroomTeacher',
        ]);

        if ($user->hasRole('teacher')) {
            $query->whereHas('subjectTeacher', function ($q) use ($user) {
                $q->where('teacher_id', $user->teacher->id);
            });
        }

        $classSubjects = $query->get()
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

        $groupedClassSubjects = $query
            ->get()
            ->groupBy('classroom.id')
            ->map(function ($groupedSubjects) {
                $firstSubject = $groupedSubjects->first();
                $classroom = $firstSubject->classroom;

                // Generate classroom name
                $name = $classroom->classLevel->alphabet;
                if ($classroom->major) {
                    $initials = preg_match_all('/\b\w/u', $classroom->major->name, $matches);
                    $majorInitials = $initials ? strtoupper(implode('', $matches[0])) : '';
                    $name .= ' ' . $majorInitials;
                }
                if ($classroom->studyGroup) {
                    $name .= ' ' . $classroom->studyGroup->name;
                }

                // Take values from the first subject for the main fields
                return [
                    'id' => $classroom->id,
                    'subject_teacher_id' => $firstSubject->subject_teacher_id, // Use actual value
                    'classroom_id' => $firstSubject->classroom_id,            // Use actual value
                    'day' => $firstSubject->day,                             // Use actual value
                    'start_time' => $firstSubject->start_time,               // Use actual value
                    'end_time' => $firstSubject->end_time,                   // Use actual value
                    'status' => $firstSubject->status,
                    'classroom' => [
                        'id' => $classroom->id,
                        'name' => $name,
                    ],
                    'subjects' => $groupedSubjects->map(function ($classSubject) {
                        return [
                            'id' => $classSubject->id,
                            'subject_teacher' => $classSubject->subjectTeacher ? [
                                'id' => $classSubject->subjectTeacher->id,  // This is the correct subject_teacher ID
                                'subject' => $classSubject->subjectTeacher->subject,
                                'teacher' => $classSubject->subjectTeacher->teacher,
                            ] : null,
                            'type' => $classSubject->type ?? 'subject',
                            'name' => $classSubject->name,
                            'day' => $classSubject->day,
                            'start_time' => $classSubject->start_time,
                            'end_time' => $classSubject->end_time,
                            'status' => $classSubject->status,
                        ];
                    })->values()->all(),
                ];
            })->values();

        return Inertia::render('classSubjects/index', compact([
            'subjectTeachers',
            'subjects',
            'teachers',
            'classSubjects',
            'classrooms',
            'groupedClassSubjects'
        ]));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $this->authorize('create_class_subject');
        $request->validate([
            'classroom_id' => 'required|exists:classrooms,id',
        ]);
        $subjectTeachers = $this->subjectTeacherService->getAllSubjectTeacher();
        $teachers = $this->teacherService->getAllTeacher();
        $classrooms = $this->classroomService->getAllClassrooms();
        $classroom = $this->classroomService->getSpecificClassroom($request->classroom_id);
        $subjects = $this->subjectService->getAllSubject();
        $classSubjects = ClassSubject::with([
            'subjectTeacher',
            'subjectTeacher.subject',
            'subjectTeacher.teacher',
            'classroom.classLevel',
            'classroom.major',
            'classroom.studyGroup',
            'classroom.shift',
            'classroom.homeroomTeacher',
        ])->get()
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

        return Inertia::render('classSubjects/create', compact([
            'classSubjects',
            'subjectTeachers',
            'teachers',
            'classrooms',
            'classroom',
            'subjects'
        ]));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClassSubjectRequest $request)
    {
        $this->authorize('create_class_subject');
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $classSubject = ClassSubject::create($validatedData);

            DB::commit();

            return redirect()
                ->route('classSubjects.index')
                ->with('success', 'Jddwal Pelajaran berhasil dibuat');
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
    public function show(string $id)
    {
        $this->authorize('view_class_subject');
        try {
            // Validasi ID classroom
            $validatedData = validator(['id' => $id], [
                'id' => ['required', 'uuid', 'exists:classrooms,id']
            ])->validate();

            $user = Auth::user();
            assert($user instanceof User);

            $subjectTeachers = $this->subjectTeacherService->getAllSubjectTeacher();
            $teachers = $this->teacherService->getAllTeacher();
            $subjects = $this->subjectService->getAllSubject();
            $classroom = $this->classroomService->getSpecificClassroom($id);

            if ($user->hasRole('teacher')) {
                $classrooms = $this->classroomService->getSpecificClassroomTeacher($user->teacher->id);
            } else {
                $classrooms = $this->classroomService->getAllClassrooms();
            }

            if (!$classroom) {
                throw new ModelNotFoundException('Classroom not found');
            }

            $query = ClassSubject::with([
                'subjectTeacher',
                'subjectTeacher.subject',
                'subjectTeacher.teacher',
                'classroom.classLevel',
                'classroom.major',
                'classroom.studyGroup',
                'classroom.shift',
                'classroom.homeroomTeacher',
            ])
                ->where('classroom_id', $id);

            if ($user->hasRole('teacher')) {
                $query->whereHas('subjectTeacher', function ($q) use ($user) {
                    $q->where('teacher_id', $user->teacher->id);
                });
            }

            $classSubjects = $query->get()
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

            return Inertia::render('classSubjects/show', compact([
                'classSubjects',
                'subjectTeachers',
                'teachers',
                'classrooms',
                'classroom',
                'subjects'
            ]));
        } catch (ValidationException $e) {
            return redirect()
                ->route('classSubjects.index')
                ->with('error', 'Kelas tidak valid: ' . $e->getMessage());
        } catch (ModelNotFoundException $e) {
            return redirect()
                ->route('classSubjects.index')
                ->with('error', 'Kelas tidak ditemukan');
        } catch (\Exception $e) {
            return redirect()
                ->route('classSubjects.index')
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $this->authorize('update_class_subject');
        try {
            // Validasi ID classroom
            $validatedData = validator(['id' => $id], [
                'id' => ['required', 'uuid', 'exists:classrooms,id']
            ])->validate();

            $subjectTeachers = $this->subjectTeacherService->getAllSubjectTeacher();
            $teachers = $this->teacherService->getAllTeacher();
            $classrooms = $this->classroomService->getAllClassrooms();
            $classroom = $this->classroomService->getSpecificClassroom($id);
            $subjects = $this->subjectService->getAllSubject();

            if (!$classroom) {
                throw new ModelNotFoundException('Classroom not found');
            }

            $classSubjects = ClassSubject::with([
                'subjectTeacher',
                'subjectTeacher.subject',
                'subjectTeacher.teacher',
                'classroom.classLevel',
                'classroom.major',
                'classroom.studyGroup',
                'classroom.shift',
                'classroom.homeroomTeacher',
            ])
                ->where('classroom_id', $id)
                ->get()
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

            return Inertia::render('classSubjects/edit', compact([
                'classSubjects',
                'subjectTeachers',
                'teachers',
                'classrooms',
                'classroom',
                'subjects'
            ]));
        } catch (ValidationException $e) {
            return redirect()
                ->route('classSubjects.index')
                ->with('error', 'Kelas tidak valid: ' . $e->getMessage());
        } catch (ModelNotFoundException $e) {
            return redirect()
                ->route('classSubjects.index')
                ->with('error', 'Kelas tidak ditemukan');
        } catch (\Exception $e) {
            return redirect()
                ->route('classSubjects.index')
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClassSubjectRequest $request, ClassSubject $classSubject)
    {
        $this->authorize('update_class_subject');
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $classSubject->update($validatedData);

            DB::commit();

            return back()->with('success', 'Jadwal Pelajaran berhasil diperbarui');
        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui Jadwal Pelajaran']);
        }
    }

    public function bulkUpdate(Request $request)
    {
        try {
            $request->validate([
                'classroom_id' => ['required', 'uuid', Rule::exists(Classroom::class, 'id')],
                'schedules' => 'required|array',
                'schedules.*.classroom_id' => ['required', 'uuid', Rule::exists(Classroom::class, 'id')],
                'schedules.*.type' => 'required|string|in:subject,break',
                'schedules.*.name' => 'nullable|string',
                'schedules.*.day' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday',
                'schedules.*.start_time' => 'required|date_format:H:i',
                'schedules.*.end_time' => 'required|date_format:H:i|after:schedules.*.start_time',
                'schedules.*.status' => 'required|boolean'
            ]);

            DB::beginTransaction();

            $classroomId = $request->classroom_id;

            // Delete existing schedules
            ClassSubject::where('classroom_id', $classroomId)->delete();

            // Process each schedule
            foreach ($request->schedules as $schedule) {
                ClassSubject::create([
                    'id' => Str::uuid(),
                    'classroom_id' => $schedule['classroom_id'],
                    'subject_teacher_id' => $schedule['type'] === 'break' ? null : $schedule['subject_teacher_id'],
                    'type' => $schedule['type'],
                    'name' => $schedule['name'],
                    'day' => $schedule['day'],
                    'start_time' => $schedule['start_time'],
                    'end_time' => $schedule['end_time'],
                    'status' => $schedule['status'],
                ]);
            }

            DB::commit();

            return back()->with('success', 'Jadwal Pelajaran berhasil diperbarui');
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Schedule update error: ' . $e->getMessage(), [
                'request_data' => $request->all()
            ]);

            return response()->json([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ClassSubject $classSubject)
    {
        $this->authorize('delete_class_subject');
        try {
            $classSubject->delete();
            return redirect()
                ->route('classSubjects.index')
                ->with('success', 'Jadwal Pelajaran berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Jadwal Pelajaran tidak ditemukan'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }

    public function bulkDestroy(Request $request)
    {
        $this->authorize('delete_class_subject');
        try {
            $request->validate([
                'ids' => ['required', 'array'],
                'ids.*' => ['required', 'uuid', Rule::exists(ClassSubject::class, 'id')],
            ]);

            ClassSubject::whereIn('id', $request->ids)->delete();

            return redirect()
                ->route('classSubjects.index')
                ->with('success', count($request->ids) . 'Jadwal Pelajaran berhasil dihapus');
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Jadwal Pelajaran yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
