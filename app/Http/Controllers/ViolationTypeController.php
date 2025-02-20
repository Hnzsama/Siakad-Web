<?php

namespace App\Http\Controllers;

use App\Models\ViolationType;
use App\Http\Requests\StoreViolationTypeRequest;
use App\Http\Requests\UpdateViolationTypeRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ViolationTypeController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        $this->authorizeResource(ViolationType::class, 'violationType');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $violationTypes = ViolationType::with('violations')->get();
        return Inertia::render('violationTypes/index', compact('violationTypes'));
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
    public function store(StoreViolationTypeRequest $request)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $violationType = ViolationType::create($validatedData);

            DB::commit();

            return redirect()
                ->route('violationTypes.index')
                ->with('success', 'Jenis Pelanggaran berhasil dibuat');
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
    public function show(ViolationType $violationType)
    {
        try {
            return inertia('violationTypes/show', [
                'violationType' => $violationType
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Jenis Pelanggaran tidak ditemukan'
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
    public function edit(ViolationType $violationType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateViolationTypeRequest $request, ViolationType $violationType)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $violationType->update($validatedData);

            DB::commit();

            return to_route('violationTypes.index');

        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui Jenis Pelanggaran']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ViolationType $violationType)
    {
        try {
            $violationType->delete();
            return redirect()
                ->route('violationTypes.index')
                ->with('success', 'Tipe Pelanggaran berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Tipe Pelanggaran tidak ditemukan'
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
                'ids.*' => ['required', 'uuid', Rule::exists(ViolationType::class, 'id')],
            ]);

            ViolationType::whereIn('id', $request->ids)->delete();

            return redirect()
                ->route('violationTypes.index')
                ->with('success', count($request->ids) . 'Tipe Pelanggaran berhasil dihapus');
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Tipe Pelanggaran yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
