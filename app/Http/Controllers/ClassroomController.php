<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Http\Requests\StoreClassroomRequest;
use App\Http\Requests\UpdateClassroomRequest;
use App\Models\Attendance;
use App\Models\Student;
use App\Service\ClassLevelService;
use App\Service\ClassroomService;
use App\Service\MajorService;
use App\Service\ShiftService;
use App\Service\StudyGroupService;
use App\Service\TeacherService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Auth\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ClassroomController extends Controller
{
    use AuthorizesRequests;

    protected $classroomService;
    protected $teacherService;
    protected $classLevel;
    protected $studyGroup;
    protected $shift;
    protected $major;

    public function __construct(
        ClassroomService $classroomService,
        TeacherService $teacherService,
        ClassLevelService $classLevelService,
        StudyGroupService $studyGroupService,
        ShiftService $shiftService,
        MajorService $majorService
    ) {
        $this->authorizeResource(Classroom::class, 'classroom');
        $this->classroomService = $classroomService;
        $this->teacherService = $teacherService;
        $this->classLevel = $classLevelService;
        $this->studyGroup = $studyGroupService;
        $this->shift = $shiftService;
        $this->major = $majorService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        assert($user instanceof User);

        $teachers = $this->teacherService->getAllTeacher();
        $classLevels = $this->classLevel->getAllClassLevel();
        $studyGroups = $this->studyGroup->getAllStudyGroup();
        $shifts = $this->shift->getAllShift();
        $majors = $this->major->getAllMajor();

        if ($user->hasRole('teacher')) {
            $classrooms = $this->classroomService->getClassroomTeacher($user->teacher->id);
        } else {
            $classrooms = $this->classroomService->getAllClassrooms();
        }

        return Inertia::render('classrooms/index', compact(
            'classrooms',
            'teachers',
            'classLevels',
            'studyGroups',
            'shifts',
            'majors'
        ));
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
    public function store(StoreClassroomRequest $request)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $classroom = Classroom::create($validatedData);

            DB::commit();

            return redirect()
                ->route('classrooms.index')
                ->with('success', 'Kelas berhasil dibuat');
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
    public function show(Classroom $classroom)
    {
        try {
            $students = Student::query()->where('classroom_id', $classroom->id)->get();
            $attendances = Attendance::with('attendable')->where('attendable_type', 'App\Models\Student')
                ->whereIn('attendable_id', $students->pluck('id'))
                ->get();
            $today = $attendances->where('date', now()->format('Y-m-d'));
            $totalPresent = $attendances->where('status', 'Present');
            $present = $today->where('status', 'Present');

            // Cek apakah ada attendance sama sekali
            $average = $attendances->count() > 0 ? round($totalPresent->count() / $attendances->count() * 100) : 0;

            // Cek apakah ada students sama sekali
            $percentage = $students->count() > 0 ? round($present->count() / $students->count() * 100) : 0;

            return inertia('classrooms/show', [
                'classroom' => $this->classroomService->getSpecificClassroom($classroom->id),
                'attendances' => $present->values(),
                'average' => $average,
                'percentage' => [
                    'percentage' => $percentage,
                    'total' => $students->count(),
                    'present' => $present->count(),
                ],
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Kelas tidak ditemukan'
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
    public function edit(Classroom $classroom)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClassroomRequest $request, Classroom $classroom)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $classroom->update($validatedData);

            DB::commit();

            return to_route('classrooms.index');
        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui Kelas']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Classroom $classroom)
    {
        try {
            $classroom->delete();
            return redirect()
                ->route('classrooms.index')
                ->with('success', 'Kelas berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Kelas tidak ditemukan'
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
                'ids.*' => ['required', 'uuid', Rule::exists(Classroom::class, 'id')],
            ]);

            Classroom::whereIn('id', $request->ids)->delete();

            return redirect()
                ->route('classrooms.index')
                ->with('success', count($request->ids) . 'Kelas berhasil dihapus');
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Kelas yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
