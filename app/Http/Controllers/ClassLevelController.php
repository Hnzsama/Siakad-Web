<?php

namespace App\Http\Controllers;

use App\Models\ClassLevel;
use App\Http\Requests\StoreClassLevelRequest;
use App\Http\Requests\UpdateClassLevelRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ClassLevelController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        $this->authorizeResource(ClassLevel::class, 'classLevel');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $classLevels = ClassLevel::all();
        return Inertia::render('classLevels/index', compact('classLevels'));
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
    public function store(StoreClassLevelRequest $request)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $classLevel = ClassLevel::create($validatedData);

            DB::commit();

            return redirect()
                ->route('classLevels.index')
                ->with('success', 'Tingkat Kelas berhasil dibuat');
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
    public function show(ClassLevel $classLevel)
    {
        try {
            return inertia('classLevels/show', [
                'classLevel' => $classLevel
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Tingkat Kelas tidak ditemukan'
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
    public function edit(ClassLevel $classLevel)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClassLevelRequest $request, ClassLevel $classLevel)
    {
        try {
            $validatedData = $request->validated();
    
            DB::beginTransaction();
    
            $classLevel->update($validatedData);
    
            DB::commit();
    
            return to_route('classLevels.index');
    
        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());
    
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui Tingkat Kelas']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ClassLevel $classLevel)
    {
        try {
            $classLevel->delete();
            return redirect()
                ->route('classLevels.index')
                ->with('success', 'Tingkat Kelas berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Tingkat Kelas tidak ditemukan'
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
                'ids.*' => ['required', 'uuid', Rule::exists(ClassLevel::class, 'id')],
            ]);

            ClassLevel::whereIn('id', $request->ids)->delete();

            return redirect()
                ->route('classLevels.index')
                ->with('success', count($request->ids) . 'Tingkat Kelas berhasil dihapus');
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Tingkat Kelas yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
