<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Service\PermissionGenerator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    use AuthorizesRequests;

    private $permissionGenerator;

    public function __construct(PermissionGenerator $permissionGenerator)
    {
        $this->authorizeResource(Role::class, 'role');
        $this->permissionGenerator = $permissionGenerator;
        // Configure which models use softdeletes
        $this->permissionGenerator->setModelWithSoftDeletes([
            'Student',
            'Theacher',
            'Guardian',
        ]);

        // Configure which models have import/export
        $this->permissionGenerator->setModelWithImportExport([
            'Student',
            'Teacher'
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::query()
            ->with('permissions')
            ->withCount('permissions')
            ->when(request('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'guard_name' => $role->guard_name,
                    'permissions_count' => $role->permissions_count,
                    'permissions' => $role->permissions->pluck('name')->reduce(function ($map, $permission) {
                        $map[$permission] = true;
                        return $map;
                    }),
                    'updated_at' => $role->updated_at,
                ];
            });

        $modelPermissions = $this->permissionGenerator->generatePermissions();

        return Inertia::render('guards/index', [
            'roles' => $roles,
            'modelPermissions' => $modelPermissions,
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
    public function store(StoreRoleRequest $request)
    {
        try {
            $validated = $request->validated();

            $name = Str::slug($validated['name']);

            if (Role::where('name', $name)->exists()) {
                return back()->withErrors([
                    'name' => 'Role dengan nama tersebut sudah ada'
                ])->withInput();
            }

            $role = Role::create([
                'name' => $name,
                'guard_name' => $validated['guard_name'],
            ]);

            if (isset($validated['permissions'])) {
                $permissions = array_keys(array_filter($validated['permissions']));

                $existingPermissions = Permission::whereIn('name', $permissions)
                    ->where('guard_name', $validated['guard_name'])
                    ->pluck('name')
                    ->toArray();

                $newPermissions = array_diff($permissions, $existingPermissions);
                foreach ($newPermissions as $permission) {
                    Permission::create([
                        'name' => $permission,
                        'guard_name' => $validated['guard_name'],
                    ]);
                }

                $role->syncPermissions($permissions);
            }

            return redirect()
                ->route('roles.index')
                ->with('success', 'Role berhasil dibuat');
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        $modelPermissions = $this->permissionGenerator->generatePermissions();
        $role->load('permissions');

        return Inertia::render('Guard/Role/Show', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
                'checkedPermissions' => $role->permissions->pluck('name')->reduce(function ($map, $permission) {
                    $map[$permission] = true;
                    return $map;
                }, []),
            ],
            'modelPermissions' => $modelPermissions
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role)
    {
        try {
            $validated = $request->validated();

            $role->update([
                'name' => Str::slug($validated['name']),
                'guard_name' => $validated['guard_name'],
            ]);

            if (isset($validated['permissions'])) {
                $permissions = array_keys(array_filter($validated['permissions']));

                $existingPermissions = Permission::whereIn('name', $permissions)
                    ->where('guard_name', $validated['guard_name'])
                    ->pluck('name')
                    ->toArray();

                $newPermissions = array_diff($permissions, $existingPermissions);
                foreach ($newPermissions as $permission) {
                    Permission::create([
                        'name' => $permission,
                        'guard_name' => $validated['guard_name'],
                    ]);
                }

                $role->syncPermissions($permissions);
            }

            return redirect()
                ->route('roles.index')
                ->with('success', 'Role berhasil diperbarui');
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        try {
            $role->delete();

            return redirect()
                ->route('roles.index')
                ->with('success', 'Role berhasil dihapus');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'error' => 'Role tidak ditemukan'
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
            $validated = $request->validate([
                'ids' => ['required', 'array'],
                'ids.*' => ['required', 'exists:roles,id']
            ]);

            Role::whereIn('id', $validated['ids'])->delete();

            return redirect()
                ->route('roles.index')
                ->with('success', count($validated['ids']) . ' roles berhasil dihapus');
        } catch (ValidationException $e) {
            return back()->withErrors([
                'error' => 'Role yang dipilih tidak valid'
            ])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
