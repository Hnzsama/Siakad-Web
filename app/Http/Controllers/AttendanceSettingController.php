<?php

namespace App\Http\Controllers;

use App\Models\AttendanceSetting;
use App\Http\Requests\StoreAttendanceSettingRequest;
use App\Http\Requests\UpdateAttendanceSettingRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AttendanceSettingController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        $this->authorizeResource(AttendanceSetting::class, 'attendanceSetting');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('update_attendance_setting');

        $attendanceSetting = AttendanceSetting::first();
        return Inertia::render('settings/attendance/index', compact('attendanceSetting'));
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
    public function store(StoreAttendanceSettingRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(AttendanceSetting $attendanceSetting)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AttendanceSetting $attendanceSetting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttendanceSettingRequest $request, AttendanceSetting $attendanceSetting)
    {
        try {
            if ($attendanceSetting) {
                // Update existing setting
                $attendanceSetting->update($request->validated());
                $message = 'Pengaturan Absensi berhasil diperbarui';
            } else {
                // Create new setting
                AttendanceSetting::create($request->validated());
                $message = 'Pengaturan Absensi berhasil dibuat';
            }

            return redirect()
                ->route('attendanceSetting.index')
                ->with('success', $message);

        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Pengaturan Absensi tidak ditemukan'
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
    public function destroy(AttendanceSetting $attendanceSetting)
    {
        try {
            $attendanceSetting->delete();
            return redirect()
                ->route('attendanceSetting.index')
                ->with('success', 'Pengaturan Absensi berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Pengaturan Absensi tidak ditemukan'
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
                'ids.*' => ['required', 'uuid', Rule::exists(AttendanceSetting::class, 'id')],
            ]);

            AttendanceSetting::whereIn('id', $request->ids)->delete();

            return redirect()
                ->route('attendanceSetting.index')
                ->with('success', count($request->ids) . 'Pengaturan Absensi berhasil dihapus');
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Pengaturan Absensi yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
