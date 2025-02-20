<?php

namespace App\Http\Controllers;

use App\Models\SubjectTeacher;
use App\Http\Requests\StoreSubjectTeacherRequest;
use App\Http\Requests\UpdateSubjectTeacherRequest;
use App\Models\User;
use App\Service\SubjectService;
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

class SubjectTeacherController extends Controller
{
    use AuthorizesRequests;
    protected $subjectService;
    protected $teacherService;

    public function __construct(
        SubjectService $subjectService,
        TeacherService $teacherService
    ) {
        $this->authorizeResource(SubjectTeacher::class, 'subjectTeacher');
        $this->subjectService = $subjectService;
        $this->teacherService = $teacherService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        assert($user instanceof User);

        $subjects = $this->subjectService->getAllSubject();
        $teachers = $this->teacherService->getAllTeacher();
        $query = SubjectTeacher::with('subject', 'teacher', 'teacher.user');

        if($user->hasRole('teacher')) {
            $query->where('teacher_id', $user->teacher->id);
        }

        $subjectTeachers = $query->get();
        return Inertia::render('subjectTeachers/index', compact([
            'subjectTeachers',
            'subjects',
            'teachers'
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
    public function store(StoreSubjectTeacherRequest $request)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $subjectTeacher = SubjectTeacher::create($validatedData);

            DB::commit();

            return redirect()
                ->route('subjectTeachers.index')
                ->with('success', 'Guru Mapel berhasil dibuat');
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
    public function show(SubjectTeacher $subjectTeacher)
    {
        try {
            return inertia('subjectTeachers/show', [
                'subjectTeacher' => $subjectTeacher
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Guru Mapel tidak ditemukan'
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
    public function edit(SubjectTeacher $subjectTeacher)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSubjectTeacherRequest $request, SubjectTeacher $subjectTeacher)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $subjectTeacher->update($validatedData);

            DB::commit();

            return to_route('subjectTeachers.index');

        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui Guru Mapel']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SubjectTeacher $subjectTeacher)
    {
        try {
            $subjectTeacher->delete();
            return redirect()
                ->route('subjectTeachers.index')
                ->with('success', 'Guru Mapel berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Guru Mapel tidak ditemukan'
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
                'ids.*' => ['required', 'uuid', Rule::exists(SubjectTeacher::class, 'id')],
            ]);

            subjectTeacher::whereIn('id', $request->ids)->delete();

            return redirect()
                ->route('subjectTeachers.index')
                ->with('success', count($request->ids) . 'Guru Mapel berhasil dihapus');
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Guru Mapel yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
