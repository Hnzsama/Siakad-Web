<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Http\Requests\StoreSubjectRequest;
use App\Http\Requests\UpdateSubjectRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SubjectController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        $this->authorizeResource(Subject::class, 'subject');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $subjects = Subject::all();
        return Inertia::render('subjects/index', compact('subjects'));
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
    public function store(StoreSubjectRequest $request)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $subject = Subject::create($validatedData);

            DB::commit();

            return redirect()
                ->route('subjects.index')
                ->with('success', 'Mata Pelajaran berhasil dibuat');
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
    public function show(Subject $subject)
    {
        try {
            return inertia('subjects/show', [
                'subject' => $subject
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Mata Pelajaran tidak ditemukan'
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
    public function edit(Subject $subject)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSubjectRequest $request, Subject $subject)
    {
        try {
            $validatedData = $request->validated();
    
            DB::beginTransaction();
    
            $subject->update($validatedData);
    
            DB::commit();
    
            return to_route('subjects.index');
    
        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());
    
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui Mata Pelajaran']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subject $subject)
    {
        try {
            $subject->delete();
            return redirect()
                ->route('subjects.index')
                ->with('success', 'Mata Pelajaran berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Mata Pelajaran tidak ditemukan'
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
                'ids.*' => ['required', 'uuid', Rule::exists(Subject::class, 'id')],
            ]);

            Subject::whereIn('id', $request->ids)->delete();

            return redirect()
                ->route('subjects.index')
                ->with('success', count($request->ids) . 'Mata Pelajaran berhasil dihapus');
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Mata Pelajaran yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
