<?php

namespace App\Http\Controllers;

use App\Models\Semester;
use App\Http\Requests\StoreSemesterRequest;
use App\Http\Requests\UpdateSemesterRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SemesterController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        $this->authorizeResource(Semester::class, 'semester');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $semesters = Semester::all();
        return Inertia::render('semesters/index', [
            'semesters' => $semesters
        ]);
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
    public function store(StoreSemesterRequest $request)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $semester = Semester::create($validatedData);

            DB::commit();

            return redirect()
                ->route('semesters.index')
                ->with('success', 'Semester berhasil dibuat');
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
    public function show(Semester $semester)
    {
        try {
            return inertia('semesters/show', [
                'semester' => $semester
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Semester tidak ditemukan'
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
    public function edit(Semester $semester)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSemesterRequest $request, Semester $semester)
    {
        try {
            $validatedData = $request->validated();
    
            DB::beginTransaction();
    
            $semester->update($validatedData);
    
            DB::commit();
    
            return to_route('semesters.index');
    
        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());
    
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui semester']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Semester $semester)
    {
        try {
            $semester->delete();
            return redirect()
                ->route('semesters.index')
                ->with('success', 'Semester berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Semester tidak ditemukan'
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
                'ids.*' => ['required', 'uuid', Rule::exists(Semester::class, 'id')],
            ]);

            Semester::whereIn('id', $request->ids)->delete();

            return redirect()
                ->route('semesters.index')
                ->with('success', count($request->ids) . 'Semester berhasil dihapus');
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Semester yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
