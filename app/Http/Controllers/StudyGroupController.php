<?php

namespace App\Http\Controllers;

use App\Models\StudyGroup;
use App\Http\Requests\StoreStudyGroupRequest;
use App\Http\Requests\UpdateStudyGroupRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class StudyGroupController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        $this->authorizeResource(StudyGroup::class, 'studyGroup');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $studyGroups = StudyGroup::all();
        return Inertia::render('studyGroups/index', compact('studyGroups'));
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
    public function store(StoreStudyGroupRequest $request)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $studyGroup = StudyGroup::create($validatedData);

            DB::commit();

            return redirect()
                ->route('studyGroups.index')
                ->with('success', 'Kelompok Belajar berhasil dibuat');
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
    public function show(StudyGroup $studyGroup)
    {
        try {
            return inertia('studyGroups/show', [
                'studyGroup' => $studyGroup
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Kelompok Belajar tidak ditemukan'
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
    public function edit(StudyGroup $studyGroup)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudyGroupRequest $request, StudyGroup $studyGroup)
    {
        try {
            $validatedData = $request->validated();
    
            DB::beginTransaction();
    
            $studyGroup->update($validatedData);
    
            DB::commit();
    
            return to_route('studyGroups.index');
    
        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());
    
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui Kelompok Belajar']);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function destroy(StudyGroup $studyGroup)
    {
        try {
            $studyGroup->delete();
            return redirect()
                ->route('studyGroups.index')
                ->with('success', 'Kelompok Belajar berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Kelompok Belajar tidak ditemukan'
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
                'ids.*' => ['required', 'uuid', Rule::exists(StudyGroup::class, 'id')],
            ]);

            StudyGroup::whereIn('id', $request->ids)->delete();

            return redirect()
                ->route('studyGroups.index')
                ->with('success', count($request->ids) . 'Kelompok Belajar berhasil dihapus');
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Kelompok Belajar yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
