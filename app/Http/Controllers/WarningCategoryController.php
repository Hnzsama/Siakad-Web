<?php

namespace App\Http\Controllers;

use App\Models\WarningCategory;
use App\Http\Requests\StoreWarningCategoryRequest;
use App\Http\Requests\UpdateWarningCategoryRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class WarningCategoryController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        $this->authorizeResource(WarningCategory::class, 'warningCategory');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $warningCategories = WarningCategory::with('warnings')
            ->withCount('warnings') // Adds the warnings_count property
            ->get()
            ->map(function ($warningCategory) {
                return [
                    ...$warningCategory->toArray(),
                    'total_warnings' => $warningCategory->warnings_count, // Use warnings_count directly
                ];
            });
        return Inertia::render('warningCategories/index', compact('warningCategories'));
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
    public function store(StoreWarningCategoryRequest $request)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $warningCategory = WarningCategory::create($validatedData);

            DB::commit();

            return redirect()
                ->route('warningCategories.index')
                ->with('success', 'Kategori peringatan berhasil dibuat');
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
    public function show(WarningCategory $warningCategory)
    {
        try {
            return inertia('warningCategories/show', [
                'warningCategory' => $warningCategory
            ]);
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Kategori peringatan tidak ditemukan'
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
    public function edit(WarningCategory $warningCategory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWarningCategoryRequest $request, WarningCategory $warningCategory)
    {
        try {
            $validatedData = $request->validated();

            DB::beginTransaction();

            $warningCategory->update($validatedData);

            DB::commit();

            return to_route('warningCategories.index');

        } catch (ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors());

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal memperbarui Kategori peringatan']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WarningCategory $warningCategory)
    {
        try {
            $warningCategory->delete();
            return redirect()
                ->route('warningCategories.index')
                ->with('success', 'Kategori peringatan berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Kategori peringatan tidak ditemukan'
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
                'ids.*' => ['required', 'uuid', Rule::exists(WarningCategory::class, 'id')],
            ]);

            WarningCategory::whereIn('id', $request->ids)->delete();

            return redirect()
                ->route('warningCategories.index')
                ->with('success', count($request->ids) . 'Kategori peringatan berhasil dihapus');
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Kategori peringatan yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
