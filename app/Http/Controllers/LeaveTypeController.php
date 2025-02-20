<?php

namespace App\Http\Controllers;

use App\Models\LeaveType;
use App\Http\Requests\StoreLeaveTypeRequest;
use App\Http\Requests\UpdateLeaveTypeRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class LeaveTypeController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        $this->authorizeResource(LeaveType::class, 'leaveType');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $leaveTypes = LeaveType::with('leaveRequests')->get();
        return Inertia::render('leaveTypes/index', compact('leaveTypes'));
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
    public function store(StoreLeaveTypeRequest $request)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $leaveType = LeaveType::create($validatedData);

            DB::commit();

            return redirect()
                ->route('leaveTypes.index')
                ->with('success', 'Jenis Cuti berhasil dibuat');
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
    public function show(LeaveType $leaveType)
    {
        try {
            return inertia('leaveTypes/show', [
                'leaveType' => $leaveType
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Jenis Cuti tidak ditemukan'
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
    public function edit(LeaveType $leaveType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeaveTypeRequest $request, LeaveType $leaveType)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $leaveType->update($validatedData);

            DB::commit();

            return to_route('leaveTypes.index');

        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui Jenis Cuti']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LeaveType $leaveType)
    {
        try {
            $leaveType->delete();
            return redirect()
                ->route('leaveTypes.index')
                ->with('success', 'Tipe Cuti berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Tipe Cuti tidak ditemukan'
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
                'ids.*' => ['required', 'uuid', Rule::exists(LeaveType::class, 'id')],
            ]);

            LeaveType::whereIn('id', $request->ids)->delete();

            return redirect()
                ->route('leaveTypes.index')
                ->with('success', count($request->ids) . 'Tipe Cuti berhasil dihapus');
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Tipe Cuti yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
