<?php

namespace App\Http\Controllers;

use App\Http\Requests\CancelViolationRequest;
use App\Models\Violation;
use App\Http\Requests\StoreViolationRequest;
use App\Http\Requests\UpdateViolationRequest;
use App\Models\Semester;
use App\Models\Student;
use App\Models\User;
use App\Models\ViolationType;
use App\Service\StudentService;
use App\Service\ViolationTypeService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ViolationController extends Controller
{
    use AuthorizesRequests;

    protected $violationTypeService;
    protected $studentService;

    public function __construct(
        ViolationTypeService $violationTypeService,
        StudentService $studentService
    ) {
        $this->violationTypeService = $violationTypeService;
        $this->studentService = $studentService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('view_any_violation');
        $violationTypes = $this->violationTypeService->getAllViolationType();
        $students = $this->studentService->getAllStudent();
        $violations = Violation::with(['student', 'semester', 'violationType', 'canceller', 'approver', 'creator', 'updater'])->get();
        return Inertia::render('violations/index', compact([
            'violations',
            'violationTypes',
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
    public function store(StoreViolationRequest $request)
    {
        $this->authorize('create_violation');
        try {
            $validatedData = $request->validated();

            $user = Auth::user();
            assert($user instanceof User);

            DB::beginTransaction();

            $semester = Semester::query()->where('status', 'active')->firstOrFail();

            $validatedData['semester_id'] = $semester->id;
            $validatedData['created_by'] = $user->id;

            $violation = Violation::create($validatedData);

            DB::commit();

            return redirect()
                ->route('violations.index')
                ->with('success', 'Pelanggaran berhasil dibuat');
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
        $this->authorize('view_violation');
        try {
            $user = Auth::user();
            assert($user instanceof User);

            $violationTypes = $this->violationTypeService->getAllViolationType();

            if ($user->hasRole('student')) {
                $violations = Violation::with(['student', 'semester', 'violationType', 'canceller', 'approver', 'creator', 'updater'])
                    ->where('student_id', $id)
                    ->where('status', 'approved')
                    ->get();
            return Inertia::render('violations/show', compact(
                'violations',
                'violationTypes'
            ));
            } else if ($user->hasRole('guardian')) {
                $students = Student::query()->where('guardian_id', $id)->get();
                $violations = Violation::with(['student', 'semester', 'violationType', 'canceller', 'approver', 'creator', 'updater'])
                    ->whereIn('student_id', $students->pluck('id'))
                    ->where('status', 'approved')
                    ->get();
                return Inertia::render('violations/show', compact([
                    'violations',
                    'students',
                    'violationTypes'
                ]));
            } else {
                $violation = Violation::with(['student', 'semester', 'violationType', 'canceller', 'approver', 'creator', 'updater'])
                    ->findOrFail($id);
            return Inertia::render('violations/show', compact(
                'violation',
                'violationTypes'
            ));
            }
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Pelanggaran tidak ditemukan'
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
    public function edit(Violation $violation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateViolationRequest $request, Violation $violation)
    {
        $this->authorize('update_violation');
        try {
            $validatedData = $request->validated();

            $user = Auth::user();
            assert($user instanceof User);

            DB::beginTransaction();

            $semester = Semester::query()->where('status', 'active')->firstOrFail();
            $validatedData['semester_id'] = $semester->id;

            $validatedData['updated_by'] = $user->id;

            $violation->update($validatedData);

            DB::commit();

            return to_route('violations.index');
        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui Pelanggaran']);
        }
    }

    public function approve(Request $request, Violation $violation)
    {
        $this->authorize('update_violation');
        try {
            $user = Auth::user();
            assert($user instanceof User);

            DB::beginTransaction();

            $violation->update([
                'approved_by' => $user->id,
                'updated_by' => $user->id,
                'status' => 'approved',
            ]);

            $violationType = ViolationType::findOrFail($violation->violation_type_id);
            $student = Student::findOrFail($violation->student_id);

            $currentViolationPoints = $student->violation_points;
            $student->update([
                'violation_points' => $currentViolationPoints + $violationType->points
            ]);

            DB::commit();

            return redirect()
                ->route('violations.index')
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

    public function cancel(CancelViolationRequest $request, Violation $violation)
    {
        $this->authorize('update_violation');
        try {
            $validatedData = $request->validated();

            $user = Auth::user();
            assert($user instanceof User);

            DB::beginTransaction();

            $validatedData['cancelled_by'] = $user->id;
            $validatedData['updated_by'] = $user->id;
            $validatedData['status'] = 'cancelled';

            $violation->update($validatedData);

            DB::commit();

            return redirect()
                ->route('violations.index')
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
    public function destroy(Violation $violation)
    {
        $this->authorize('delete_violation');
        try {
            $violation->delete();
            return redirect()
                ->route('violations.index')
                ->with('success', 'Pelanggaran berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Pelanggaran tidak ditemukan'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }

    public function bulkDestroy(Request $request)
    {
        $this->authorize('delete_violation');
        try {
            $request->validate([
                'ids' => ['required', 'array'],
                'ids.*' => ['required', 'uuid', Rule::exists(Violation::class, 'id')],
            ]);

            Violation::whereIn('id', $request->ids)->delete();

            return redirect()
                ->route('violations.index')
                ->with('success', count($request->ids) . 'Pelanggaran berhasil dihapus');
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Pelanggaran yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
