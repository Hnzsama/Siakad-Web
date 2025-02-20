<?php

namespace App\Http\Controllers;

use App\Http\Requests\RejectLeaveRequestRequest;
use App\Models\LeaveRequest;
use App\Http\Requests\StoreLeaveRequestRequest;
use App\Http\Requests\UpdateLeaveRequestRequest;
use App\Models\Semester;
use App\Models\Student;
use App\Models\User;
use App\Service\LeaveTypeService;
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

class LeaveRequestController extends Controller
{
    use AuthorizesRequests;

    protected $leaveTypeService;
    protected $studentService;
    protected $teacherService;

    public function __construct(
        LeaveTypeService $leaveTypeService,
        StudentService $studentService,
        TeacherService $teacherService
    ) {
        $this->leaveTypeService = $leaveTypeService;
        $this->studentService = $studentService;
        $this->teacherService = $teacherService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('view_any_leave_request');
        $leaveTypes = $this->leaveTypeService->getAllLeaveType();
        $students = $this->studentService->getAllStudent();
        $teachers = $this->teacherService->getAllTeacher();
        $leaveRequests = LeaveRequest::with(['leavable', 'semester', 'leaveType'])->get();
        return Inertia::render('leaveRequests/index', compact([
            'leaveRequests',
            'leaveTypes',
            'students',
            'teachers',
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
    public function store(StoreLeaveRequestRequest $request)
    {
        $this->authorize('create_leave_request');
        try {
            $user = Auth::user();
            assert($user instanceof User);

            $validatedData = $request->validated();

            DB::beginTransaction();

            $semester = Semester::query()->where('status', 'Active')->firstOrFail();
            $validatedData['semester_id'] = $semester->id;

            $leaveRequest = LeaveRequest::create($validatedData);

            DB::commit();

            if ($user->hasRole('teacher')) {
                return redirect()
                    ->route('leaveRequests.show', $user->teacher->id)
                    ->with('success', 'Permintaan Cuti berhasil diajukan');
            } else if ($user->hasRole('guardian')) {
                return redirect()
                    ->route('leaveRequests.show', $user->guardian->id)
                    ->with('success', 'Permintaan Cuti berhasil diajukan');
            } else {
                return redirect()
                    ->route('leaveRequests.index')
                    ->with('success', 'Permintaan Cuti berhasil diajukan');
            }
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
        $this->authorize('view_leave_request');
        try {
            $leaveTypes = $this->leaveTypeService->getAllLeaveType();
            $students = $this->studentService->getAllStudent();
            $teachers = $this->teacherService->getAllTeacher();
            $user = Auth::user();
            assert($user instanceof User);

            $query = LeaveRequest::with(['leavable', 'semester', 'leaveType', 'approver', 'repellent']);

            if ($user->hasRole('teacher')) {
                $leaveRequests = $query
                    ->where('leavable_type', 'App\Models\Teacher')
                    ->where('leavable_id', $id)
                    ->get();
                return Inertia::render('leaveRequests/show', compact([
                    'leaveRequests',
                    'leaveTypes',
                    'students',
                    'teachers',
                ]));
            } else if ($user->hasRole('guardian')) {
                $students = Student::query()->where('guardian_id', $user->guardian->id)->get();
                $studentIds = $students->pluck('id');
                $leaveRequests = $query
                    ->where('leavable_type', 'App\Models\Student')
                    ->whereIn('leavable_id', $studentIds)
                    ->get();
                return Inertia::render('leaveRequests/show', compact([
                    'leaveRequests',
                    'students',
                    'teachers',
                    'leaveTypes',
                ]));
            } else if ($user->hasRole('student')) {
                $leaveRequests = $query
                    ->where('leavable_type', 'App\Models\Student')
                    ->where('leavable_id', $id)
                    ->get();
                return Inertia::render('leaveRequests/show', compact('leaveRequests'));
            } else {
                $leaveRequest = $query->findOrFail($id);
                return Inertia::render('leaveRequests/show', compact('leaveRequest'));
            }
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Permintaan Cuti tidak ditemukan'
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
    public function edit(LeaveRequest $leaveRequest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeaveRequestRequest $request, LeaveRequest $leaveRequest)
    {
        $this->authorize('update_leave_request');
        try {
            $user = Auth::user();
            assert($user instanceof User);

            $validatedData = $request->validated();

            DB::beginTransaction();

            if ($request->hasFile('attachment_url')) {
                // Handle file upload if new file is provided
                $validatedData['attachment_url'] = $request->file('attachment_url')
                    ->store('attachments', 'public');
            } else {
                // Remove attachment_url from validated data if no new file
                unset($validatedData['attachment_url']);
            }

            $leaveRequest->update($validatedData);

            DB::commit();

            if ($user->hasRole('teacher')) {
                return redirect()
                    ->route('leaveRequests.show', $user->teacher->id)
                    ->with('success', 'Permintaan izin berhasil diperbarui');
            } else if ($user->hasRole('guardian')) {
                return redirect()
                    ->route('leaveRequests.show', $user->guardian->id)
                    ->with('success', 'Permintaan izin berhasil diperbarui');
            } else {
                return redirect()
                    ->route('leaveRequests.index')
                    ->with('success', 'Permintaan izin berhasil diperbarui');
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui Permintaan izin: ' . $e->getMessage()]);
        }
    }

    public function approve(Request $request, LeaveRequest $leaveRequest)
    {
        $this->authorize('update_leave_request');
        try {
            $user = Auth::user();
            assert($user instanceof User);

            DB::beginTransaction();

            $leaveRequest->update([
                'approved_by' => $user->id,
                'status' => 'Approved',
            ]);

            DB::commit();

            return redirect()
                ->route('leaveRequests.index')
                ->with('success', 'Permintaan Cuti berhasil disetujui');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Permintaan Cuti tidak ditemukan'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }

    public function reject(RejectLeaveRequestRequest $request, LeaveRequest $leaveRequest)
    {
        $this->authorize('update_leave_request');
        try {
            $validatedData = $request->validated();

            $user = Auth::user();
            assert($user instanceof User);

            DB::beginTransaction();

            $validatedData['rejected_by'] = $user->id;
            $validatedData['status'] = 'Rejected';

            $leaveRequest->update($validatedData);

            DB::commit();

            return redirect()
                ->route('leaveRequests.index')
                ->with('success', 'Persetujuan Permintaan Cuti berhasil dibatalkan');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Permintaan Cuti tidak ditemukan'
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
    public function destroy(LeaveRequest $leaveRequest)
    {
        $this->authorize('delete_leave_request');
        try {
            $leaveRequest->delete();
            return redirect()
                ->route('leaveRequests.index')
                ->with('success', 'Permintaan Cuti berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Permintaan Cuti tidak ditemukan'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }

    public function bulkDestroy(Request $request)
    {
        $this->authorize('delete_leave_request');
        try {
            $request->validate([
                'ids' => ['required', 'array'],
                'ids.*' => ['required', 'uuid', Rule::exists(LeaveRequest::class, 'id')],
            ]);

            LeaveRequest::whereIn('id', $request->ids)->delete();

            return redirect()
                ->route('leaveRequests.index')
                ->with('success', count($request->ids) . 'Permintaan Cuti berhasil dihapus');
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Permintaan Cuti yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
