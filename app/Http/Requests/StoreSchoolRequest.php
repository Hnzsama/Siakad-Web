<?php

namespace App\Http\Requests;

use App\Models\District;
use App\Models\Province;
use App\Models\Regency;
use App\Models\School;
use App\Models\SchoolLevel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSchoolRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'npsn' => ['required', 'numeric',
                Rule::unique(School::class)
            ],
            'schoolLevel' => ['required', 'string'],
            'address' => ['required', 'string'],
            'province_code' => ['required', 'numeric',
                Rule::exists(Province::class, 'code')
            ],
            'regency_code' => ['required', 'numeric',
                Rule::exists(Regency::class, 'code')
            ],
            'district_code' => ['required', 'numeric',
                Rule::exists(District::class, 'code')
            ],
            'postal_code' => ['required', 'string'],
            'phone' => ['nullable', 'string',
                Rule::unique(School::class)
            ],
            'email' => ['nullable', 'email',
                Rule::unique(School::class)
            ],
            'website' => ['nullable', 'url',
                Rule::unique(School::class)
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
        ];
    }
}
