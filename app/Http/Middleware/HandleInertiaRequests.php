<?php

namespace App\Http\Middleware;

use App\Models\School;
use App\Service\SchoolSettingsService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';
    protected $schoolSettingsService;

    public function __construct(SchoolSettingsService $schoolSettingsService)
    {
        $this->schoolSettingsService = $schoolSettingsService;
    }

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $scholl = School::first();
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? $this->getUserWithRelations($request->user()) : null,
            ],
            'school' => $this->schoolSettingsService->getSchoolSettings(),
        ];
    }

    private function getUserWithRelations($user)
    {
        // Load roles beserta permissions-nya
        $user->load('roles.permissions');

        if ($user->teacher()->exists()) {
            $user->load('teacher.homeroomTeacher', 'teacher.shift');
        }

        if ($user->student()->exists()) {
            $user->load('student.classroom', 'student.guardian');
        }

        if ($user->guardian()->exists()) {
            $user->load('guardian');
        }

        return $user;
    }
}
