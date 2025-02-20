<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Http\Requests\StoreScheduleRequest;
use App\Http\Requests\UpdateScheduleRequest;
use App\Models\Shift;
use App\Service\ShiftService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    use AuthorizesRequests;

    protected $shiftService;

    public function __construct(ShiftService $shiftService)
    {
        $this->authorizeResource(Schedule::class, 'schedule');
        $this->shiftService = $shiftService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $shifts = $this->shiftService->getAllShift();
        $schedules = Schedule::query()->with('shift')->get();
        return Inertia::render('schedules/index', compact('schedules', 'shifts'));
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
    public function store(StoreScheduleRequest $request)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $schedule = Schedule::create($validatedData);

            DB::commit();

            return redirect()
                ->route('schedules.index')
                ->with('success', 'Jadwal berhasil dibuat');
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
    public function show(Schedule $schedule)
    {
        try {
            return inertia('schedules/show', [
                'sc$schedule' => $schedule
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Jadwal tidak ditemukan'
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
    public function edit(Schedule $schedule)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateScheduleRequest $request, Schedule $schedule)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $schedule->update($validatedData);

            DB::commit();

            return to_route('schedules.index');
        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui Jadwal']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Schedule $schedule)
    {
        try {
            $schedule->delete();
            return redirect()
                ->route('schedules.index')
                ->with('success', 'Jadwal berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Jadwal tidak ditemukan'
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
                'ids.*' => ['required', 'uuid', Rule::exists(Schedule::class, 'id')],
            ]);

            Schedule::whereIn('id', $request->ids)->delete();

            return redirect()
                ->route('schedules.index')
                ->with('success', count($request->ids) . 'Jadwal berhasil dihapus');
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Jadwal yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
