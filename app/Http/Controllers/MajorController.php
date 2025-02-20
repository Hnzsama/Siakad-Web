<?php

namespace App\Http\Controllers;

use App\Models\Major;
use App\Http\Requests\StoreMajorRequest;
use App\Http\Requests\UpdateMajorRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class MajorController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        $this->authorizeResource(Major::class, 'major');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $majors = Major::all();
        return Inertia::render('majors/index', compact('majors'));
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
    public function store(StoreMajorRequest $request)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $major = Major::create($validatedData);

            DB::commit();

            return redirect()
                ->route('majors.index')
                ->with('success', 'Jurusan berhasil dibuat');
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
    public function show(Major $major)
    {
        try {
            return inertia('majors/show', [
                'major' => $major
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Jurusan tidak ditemukan'
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
    public function edit(Major $major)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMajorRequest $request, Major $major)
    {
        try {
            $validatedData = $request->validated();
    
            DB::beginTransaction();
    
            $major->update($validatedData);
    
            DB::commit();
    
            return to_route('majors.index');
    
        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());
    
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui jurusan']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Major $major)
    {
        try {
            $major->delete();
            return redirect()
                ->route('majors.index')
                ->with('success', 'Jurusan berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Jurusan tidak ditemukan'
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
                'ids.*' => ['required', 'uuid', Rule::exists(Major::class, 'id')],
            ]);

            Major::whereIn('id', $request->ids)->delete();

            return redirect()
                ->route('majors.index')
                ->with('success', count($request->ids) . 'Jurusan berhasil dihapus');
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Jurusan yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
