<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use App\Http\Requests\StoreShiftRequest;
use App\Http\Requests\UpdateShiftRequest;
use App\Models\Classroom;
use App\Models\ClassSubject;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class ShiftController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        $this->authorizeResource(Shift::class, 'shift');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $this->authorize('viewAny', Shift::class);
        $shifts = Shift::with('schedules')->get();
        return Inertia::render('shifts/index', compact('shifts'));
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
    public function store(StoreShiftRequest $request)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $shift = Shift::create($validatedData);

            DB::commit();

            return redirect()
                ->route('shifts.index')
                ->with('success', 'Shift berhasil dibuat');
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
    public function show(Shift $shift)
    {
        try {
            return inertia('shifts/show', [
                'shift' => $shift
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Shift tidak ditemukan'
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
    public function edit(Shift $shift)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateShiftRequest $request, Shift $shift)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            // Check if class_duration is being changed
            if (isset($validatedData['class_duration']) &&
                $validatedData['class_duration'] !== $shift->class_duration) {
                $this->deleteRelatedClassSubject($shift->id);
            }

            $shift->update($validatedData);

            DB::commit();

            return to_route('shifts.index')
                ->with('success', 'Shift berhasil diperbarui');

        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors([
                'error' => 'Gagal memperbarui shift: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Shift $shift)
    {
        try {
            $shift->delete();
            return redirect()
                ->route('shifts.index')
                ->with('success', 'Shift berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Shift tidak ditemukan'
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
                'ids.*' => ['required', 'uuid', Rule::exists(Shift::class, 'id')],
            ]);

            Shift::whereIn('id', $request->ids)->delete();

            return redirect()
                ->route('shifts.index')
                ->with('success', count($request->ids) . 'Shift berhasil dihapus');
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Shift yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }

    private function deleteRelatedClassSubject($shift_id)
    {
        try {
            $validator = Validator::make(
                ['shift_id' => $shift_id],
                [
                    'shift_id' => [
                        'required',
                        'string',
                        'uuid',
                        Rule::exists('shifts', 'id')
                    ]
                ],
                [
                    'shift_id.required' => 'ID shift diperlukan',
                    'shift_id.string' => 'ID shift harus berupa string',
                    'shift_id.uuid' => 'ID shift harus berupa UUID yang valid',
                    'shift_id.exists' => 'ID shift tidak ditemukan dalam database'
                ]
            );

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

            DB::beginTransaction();

            $classrooms = Classroom::query()
                ->where('shift_id', $shift_id)
                ->get();

            if ($classrooms->isEmpty()) {
                DB::commit();
                return true;
            }

            foreach ($classrooms as $classroom) {
                $deleted = ClassSubject::where('classroom_id', $classroom->id)->delete();
                if ($deleted === false) {
                    throw new \RuntimeException('Gagal menghapus mata pelajaran kelas');
                }
            }

            DB::commit();
            return true;

        } catch (ValidationException $e) {
            DB::rollBack();
            throw new ValidationException($e->validator);
        } catch (\Exception $e) {
            DB::rollBack();
            throw new \RuntimeException('Gagal menghapus mata pelajaran terkait: ' . $e->getMessage());
        }
    }
}
