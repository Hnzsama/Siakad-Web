<?php

namespace App\Http\Controllers;

use App\Models\Agency;
use App\Http\Requests\StoreAgencyRequest;
use App\Http\Requests\UpdateAgencyRequest;
use App\Models\User;
use App\Service\StudentService;
use App\Service\TeacherService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AgencyController extends Controller
{
    use AuthorizesRequests;

    protected $studentService;
    protected $teacherService;

    public function __construct(
        StudentService $studentService,
        TeacherService $teacherService
    ) {
        // $this->authorizeResource(Agency::class, 'agency');
        $this->studentService = $studentService;
        $this->teacherService = $teacherService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('view_any_agency');
        $user = Auth::user();
        assert($user instanceof User);

        $students = $this->studentService->getAllStudent();
        $teachers = $this->teacherService->getAllTeacher();

        $query = Agency::with('agencyable');

        if ($user->hasRole('teacher')) {
            $query->where('agencyable_id', $user->teacher->id);
        }

        $agencies = $query->get();
        return Inertia::render('agencies/index', compact([
            'agencies',
            'students',
            'teachers'
        ]));
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
    public function store(StoreAgencyRequest $request)
    {
        $this->authorize('create_agency');
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $agency = Agency::create($validatedData);

            DB::commit();

            return redirect()
                ->route('agencies.index')
                ->with('success', 'Instansi berhasil dibuat');
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
    public function show(String $id)
    {
        $this->authorize('view_agency');
        try {
            $user = Auth::user();
            assert($user instanceof User);

            if ($user->hasRole('teacher') || $user->hasRole('student')) {
                $agencies = Agency::query()->where('agencyable_id', $id)->get();
                return Inertia::render('agencies/show', [
                    'agencies' => $agencies
                ]);
            } else {
                $agency = Agency::findOrFail($id)->load('agencyable');
                return Inertia::render('agencies/show', [
                    'agency' => $agency
                ]);
            }
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Instansi tidak ditemukan'
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
    public function edit(Agency $agency)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAgencyRequest $request, Agency $agency)
    {
        $this->authorize('update_agency');
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $agency->update($validatedData);

            DB::commit();

            return to_route('agencies.index');
        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui Instansi']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Agency $agency)
    {
        $this->authorize('delete_agency');
        try {
            $agency->delete();
            return redirect()
                ->route('agencies.index')
                ->with('success', 'Instansi berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Instansi tidak ditemukan'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }

    public function bulkDestroy(Request $request)
    {
        $this->authorize('delete_agency');
        try {
            $request->validate([
                'ids' => ['required', 'array'],
                'ids.*' => ['required', 'uuid', Rule::exists(Agency::class, 'id')],
            ]);

            Agency::whereIn('id', $request->ids)->delete();

            return redirect()
                ->route('agencies.index')
                ->with('success', count($request->ids) . 'Instansi berhasil dihapus');
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Instansi yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
