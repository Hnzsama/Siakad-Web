<?php

namespace App\Http\Controllers;

use App\Http\Requests\CancelWarningLetterRequest;
use App\Models\WarningLetter;
use App\Http\Requests\StoreWarningLetterRequest;
use App\Http\Requests\UpdateWarningLetterRequest;
use App\Models\Guardian;
use App\Models\Semester;
use App\Models\Student;
use App\Models\User;
use App\Service\StudentService;
use App\Service\WarningCategoryService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class WarningLetterController extends Controller
{
    use AuthorizesRequests;

    protected $warningCategoryService;
    protected $studentService;

    public function __construct(
        WarningCategoryService $warningCategoryService,
        StudentService $studentService
    ) {
        $this->warningCategoryService = $warningCategoryService;
        $this->studentService = $studentService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('view_any_warning_letter');
        $warningCategories = $this->warningCategoryService->getAllWarningCategory();
        $students = $this->studentService->getAllStudent();
        $warningLetters = WarningLetter::with(['student', 'semester', 'warningCategory', 'parent', 'parent.user', 'repellent', 'approver', 'creator', 'updater'])->get();
        return Inertia::render('warningLetters/index', compact([
            'warningLetters',
            'warningCategories',
            'students',
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
    public function store(StoreWarningLetterRequest $request)
    {
        $this->authorize('create_warning_letter');
        try {
            $validatedData = $request->validated();

            $user = Auth::user();
            assert($user instanceof User);

            DB::beginTransaction();

            $semester = Semester::query()->where('status', 'active')->firstOrFail();
            $student = Student::findOrFail($validatedData['student_id']);
            $parent = Guardian::findOrFail($student->guardian_id);

            $validatedData['semester_id'] = $semester->id;
            $validatedData['created_by'] = $user->id;
            $validatedData['parent_id'] = $parent->id;

            $warningLetter = WarningLetter::create($validatedData);

            DB::commit();

            return redirect()
                ->route('warningLetters.index')
                ->with('success', 'Surat peringatan berhasil dibuat');
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
    public function show(Request $request, String $id)
    {
        $this->authorize('view_warning_letter');
        try {
            $user = Auth::user();
            assert($user instanceof User);

            $query = WarningLetter::with([
                'student',
                'semester',
                'warningCategory',
                'parent',
                'parent.user',
                'repellent',
                'approver',
                'creator',
                'updater'
            ])->where('status', 'approved');

            if ($user->hasRole('student')) {
                $query->where('student_id', $user->student->id);
                $warningLetters = $query->get();

                return Inertia::render('warningLetters/show', [
                    'warningLetters' => $warningLetters,
                    'filters' => [
                        'student' => $user->student->id,
                        'filter' => $request->input('filter', 'unread')
                    ]
                ]);
            } else if ($user->hasRole('guardian')) {
                $students = Student::where('guardian_id', $id)->get();
                // Apply student filter if provided
                if ($request->has('student')) {
                    $query->where('student_id', $request->student);
                } else {
                    $query->whereIn('student_id', $students->pluck('id'));
                }

                $warningLetters = $query->get();

                return Inertia::render('warningLetters/show', [
                    'students' => $students,
                    'warningLetters' => $warningLetters,
                    'filters' => [
                        'student' => $request->student,
                    ]
                ]);
            } else {
                $warningLetter = $query->findOrFail($id);
                return Inertia::render('warningLetters/show', compact('warningLetter'));
            }
        } catch (ModelNotFoundException $e) {
            return response()->json($e->getMessage(), 404);
        } catch (\Exception $e) {
            return response()->json($e->getMessage(), 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WarningLetter $warningLetter)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWarningLetterRequest $request, WarningLetter $warningLetter)
    {
        $this->authorize('update_warning_letter');
        try {
            $validatedData = $request->validated();

            $user = Auth::user();
            assert($user instanceof User);

            DB::beginTransaction();

            $semester = Semester::query()->where('status', 'active')->firstOrFail();
            $validatedData['semester_id'] = $semester->id;

            if (isset($validatedData['student_id'])) {
                $student = Student::findOrFail($validatedData['student_id']);
                $parent = Guardian::findOrFail($student->guardian_id);
                $validatedData['parent_id'] = $parent->id;
            }

            $validatedData['updated_by'] = $user->id;

            $warningLetter->update($validatedData);

            DB::commit();

            return to_route('warningLetters.index');
        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui Surat peringatan']);
        }
    }

    public function receive(Request $request, WarningLetter $warningLetter)
    {
        $user = Auth::user();
        assert($user instanceof User);

        if (!$user->hasRole('guardian')) {
            abort(403, 'Unauthorized action.');
        }

        try {
            DB::beginTransaction();

            $warningLetter->update([
                'parent_received_at' => now(),
            ]);

            DB::commit();

            // Get guardian ID for the redirect
            $guardianId = $user->guardian->id;

            return redirect()->route('warningLetters.show', [
                'warningLetter' => $guardianId,
                'student' => $request->input('student', $warningLetter->student_id),
                'filter' => $request->input('filter', 'unread')
            ])->with('success', 'Surat peringatan berhasil diterima');
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function approve(Request $request, WarningLetter $warningLetter)
    {
        $this->authorize('update_warning_letter');
        try {
            $user = Auth::user();
            assert($user instanceof User);

            DB::beginTransaction();

            $warningLetter->update([
                'approved_by' => $user->id,
                'updated_by' => $user->id,
                'status' => 'approved',
            ]);

            DB::commit();

            return redirect()
                ->route('warningLetters.index')
                ->with('success', 'Surat peringatan berhasil disetujui');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Surat peringatan tidak ditemukan'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }

    public function cancel(CancelWarningLetterRequest $request, WarningLetter $warningLetter)
    {
        $this->authorize('update_warning_letter');
        try {
            $validatedData = $request->validated();

            $user = Auth::user();
            assert($user instanceof User);

            DB::beginTransaction();

            $validatedData['cancelled_by'] = $user->id;
            $validatedData['updated_by'] = $user->id;
            $validatedData['status'] = 'cancelled';

            $warningLetter->update($validatedData);

            DB::commit();

            return redirect()
                ->route('warningLetters.index')
                ->with('success', 'Persetujuan surat peringatan berhasil dibatalkan');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Surat peringatan tidak ditemukan'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WarningLetter $warningLetter)
    {
        $this->authorize('delete_warning_letter');
        try {
            $warningLetter->delete();
            return redirect()
                ->route('warningLetters.index')
                ->with('success', 'Surat peringatan berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Surat peringatan tidak ditemukan'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }

    public function bulkDestroy(Request $request)
    {
        $this->authorize('delete_warning_letter');
        try {
            $request->validate([
                'ids' => ['required', 'array'],
                'ids.*' => ['required', 'uuid', Rule::exists(WarningLetter::class, 'id')],
            ]);

            WarningLetter::whereIn('id', $request->ids)->delete();

            return redirect()
                ->route('warningLetters.index')
                ->with('success', count($request->ids) . 'Surat peringatan berhasil dihapus');
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Surat peringatan yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
