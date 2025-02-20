<?php

namespace App\Http\Controllers;

use App\Models\Guardian;
use App\Http\Requests\StoreGuardianRequest;
use App\Http\Requests\UpdateGuardianRequest;
use App\Models\Student;
use App\Models\User;
use App\Service\ClassroomService;
use App\Service\UserService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class GuardianController extends Controller
{
    use AuthorizesRequests;

    protected $userService;
    protected $classroomService;

    public function __construct(
        UserService $userService,
        ClassroomService $classroomService
    ) {
        $this->authorizeResource(Guardian::class, 'guardian');
        $this->userService = $userService;
        $this->classroomService = $classroomService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        assert($user instanceof User);

        $query = Guardian::with('user', 'children');

        if ($user->hasRole('teacher')) {
            $query->whereHas('children.classroom', function ($query) use ($user) {
                $query->where('teacher_id', $user->teacher->id);
            });
        }

        $guardians = $query->get();
        return Inertia::render('guardians/index', compact('guardians'));
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
    public function store(StoreGuardianRequest $request)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $user = $this->userService->generateUser('guardian', $validatedData['name'], $validatedData['email'], $validatedData['phone'], $validatedData['date_of_birth']);

            $validatedData['user_id'] = $user->id;

            $guardian = Guardian::create($validatedData);

            DB::commit();

            return redirect()
                ->route('guardians.index')
                ->with('success', 'Orang tua berhasil dibuat');
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
    public function show(Guardian $guardian)
    {
        try {
            $guardian->load(['user', 'children.classroom.classLevel', 'children.classroom.major', 'children.classroom.studyGroup']);

            $data = $guardian->toArray();

            // Format classroom names for each child
            $data['children'] = collect($guardian->children)->map(function ($child) {
                $childData = $child->toArray();
                if ($child->classroom) {
                    $childData['classroom']['name'] = $this->classroomService->formatClassroomName($child->classroom);
                }
                return $childData;
            })->all();

            return inertia('guardians/show', [
                'guardian' => $data
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Orang tua tidak ditemukan'
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
    public function edit(Guardian $guardian)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGuardianRequest $request, Guardian $guardian)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $guardian->update($validatedData);

            DB::commit();

            return redirect()
                ->route('guardians.index')
                ->with('success', 'Orang tua berhasil diperbarui');
        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui Orang tua']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Guardian $guardian)
    {
        $this->authorize('delete_guardian');
        try {
            DB::beginTransaction();
            try {
                // Set guardian_id to null for all related students
                // Student::where('guardian_id', $guardian->id)
                //     ->update(['guardian_id' => null]);

                // Delete guardian and user
                $user = User::findOrFail($guardian->user_id);
                $guardian->delete();
                $user->delete();

                DB::commit();

                return redirect()
                    ->route('guardians.index')
                    ->with('success', 'Orang tua berhasil dihapus');
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Orang tua tidak ditemukan'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }

    public function bulkDestroy(Request $request)
    {
        $this->authorize('delete_guardian');
        try {
            $request->validate([
                'ids' => ['required', 'array'],
                'ids.*' => ['required', 'uuid', Rule::exists(Guardian::class, 'id')],
            ]);

            DB::beginTransaction();
            try {
                // Set guardian_id to null for all related students
                Student::whereIn('guardian_id', $request->ids)
                    ->update(['guardian_id' => null]);

                $guardians = Guardian::whereIn('id', $request->ids)->get();
                $userIds = $guardians->pluck('user_id');

                // Delete guardians and users
                Guardian::whereIn('id', $request->ids)->delete();
                User::whereIn('id', $userIds)->delete();

                DB::commit();

                return redirect()
                    ->route('guardians.index')
                    ->with('success', count($request->ids) . ' Orang tua berhasil dihapus');
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Orang tua yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
