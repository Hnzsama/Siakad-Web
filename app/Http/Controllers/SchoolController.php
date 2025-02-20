<?php

namespace App\Http\Controllers;

use App\Models\School;
use App\Http\Requests\StoreSchoolRequest;
use App\Http\Requests\UpdateSchoolRequest;
use App\Models\District;
use App\Models\Province;
use App\Models\Regency;
use App\Service\RegionalService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SchoolController extends Controller
{
    use AuthorizesRequests;

    protected $regionalService;

    public function __construct(RegionalService $regionalService)
    {
        $this->authorizeResource(School::class, 'school');
        $this->regionalService = $regionalService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $schools = School::with(['province', 'regency', 'district'])->get();
        $filters = $this->regionalService->getRegional();
        return Inertia::render('schools/index', [
            'schools' => $schools,
            'provinces' => $filters['provinces'],
            'regencies' => $filters['regencies'],
            'districts' => $filters['districts'],
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
    public function store(StoreSchoolRequest $request)
    {
        try {
            School::create($request->validated());
            return redirect()
                ->route('schools.index')
                ->with('success', 'Sekolah berhasil ditambahkan');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
            // dd($e->errors());
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(School $school)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(School $school)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSchoolRequest $request, School $school)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(School $school)
    {
        try {
            $school->delete();
            return redirect()
                ->route('schools.index')
                ->with('success', 'Sekolah berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Sekolah tidak ditemukan'
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
                'ids.*' => ['required', 'uuid', Rule::exists(School::class, 'id')],
            ]);

            School::whereIn('id', $request->ids)->delete();

            return redirect()
                ->route('schools.index')
                ->with('success', count($request->ids) . 'Sekolah berhasil dihapus');
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Sekolah yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
