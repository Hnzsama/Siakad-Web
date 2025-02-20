<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Http\Requests\UpdateSchoolRequest;
use App\Models\District;
use App\Models\Province;
use App\Models\Regency;
use App\Models\School;
use App\Models\User;
use App\Service\RegionalService;
use App\Service\SchoolSettingsService;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    protected $regionalService;
    protected $schoolSettingsService;

    public function __construct(
        RegionalService $regionalService,
        SchoolSettingsService $schoolSettingsService
    ) {
        $this->regionalService = $regionalService;
        $this->schoolSettingsService = $schoolSettingsService;
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $regional = $this->regionalService->getRegional();
        return Inertia::render('settings/profile/index', [
            'provinces' => $regional['provinces'],
            'regencies' => $regional['regencies'],
            'districts' => $regional['districts'],
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request)
    {
        $attributes = $request->validated();
        $user = $request->user();

        // Update student profile
        if ($user->hasRole('student') && $user->student) {
            $studentAttributes = array_intersect_key($attributes, array_flip([
                'name',
                'nik',
                'gender',
                'place_of_birth',
                'date_of_birth',
                'address',
                'phone',
                'email',
                'status'
            ]));
            $user->student->fill($studentAttributes);
            $user->student->update($studentAttributes);
        }

        // Update teacher profile
        if ($user->hasRole('teacher') && $user->teacher) {
            $teacherAttributes = array_intersect_key($attributes, array_flip([
                'name',
                'nip',
                'gender',
                'place_of_birth',
                'date_of_birth',
                'highest_education',
                'major',
                'university',
                'certification',
                'address',
                'phone',
                'email',
                'position',
                'subject',
                'year_started',
                'year_ended',
                'work_experience',
                'status'
            ]));
            $user->teacher->fill($teacherAttributes);
            $user->teacher->update($teacherAttributes);
        }

        // Update guardian profile
        if ($user->hasRole('guardian') && $user->guardian) {
            $guardianAttributes = array_intersect_key($attributes, array_flip([
                'name',
                'relationship',
                'nik',
                'date_of_birth',
                'address',
                'phone',
                'email',
                'gender',
                'occupation',
                'income',
                'status'
            ]));
            $user->guardian->fill($guardianAttributes);
            $user->guardian->update($guardianAttributes);
        }

        return Redirect::route('profile.edit');
    }

    public function updateSchool(Request $request, string $id)
    {
        // dd($request);
        $attributes = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'npsn' => [
                'required',
                'numeric',
                Rule::unique(School::class)->ignore($id)
            ],
            'schoolLevel' => ['required', 'string'],
            'address' => ['required', 'string'],
            'province_code' => [
                'required',
                'numeric',
                Rule::exists(Province::class, 'code')
            ],
            'regency_code' => [
                'required',
                'numeric',
                Rule::exists(Regency::class, 'code')
            ],
            'district_code' => [
                'required',
                'numeric',
                Rule::exists(District::class, 'code')
            ],
            'postal_code' => ['required', 'string'],
            'phone' => [
                'nullable',
                'string',
                Rule::unique(School::class)->ignore($id)
            ],
            'email' => [
                'nullable',
                'email',
                Rule::unique(School::class)->ignore($id)
            ],
            'website' => [
                'nullable',
                'url',
                Rule::unique(School::class)->ignore($id)
            ],
            'accreditation' => ['nullable', 'string'],
            'accreditation_year' => ['nullable', 'string'],
            'headmaster' => ['nullable', 'string'],
            'teacher_count' => ['nullable', 'numeric'],
            'student_count' => ['nullable', 'numeric'],
            'ownership' => ['nullable', 'string'],
            'establishment_year' => ['nullable', 'string'],
            'curiculum' => ['nullable', 'string'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'status' => ['required', 'boolean']
        ]);

        $school = $this->schoolSettingsService->updateSchoolSettings($attributes);

        // Redirect back to the profile edit page
        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
