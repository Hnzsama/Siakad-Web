<?php

namespace App\Http\Requests;

use App\Models\School;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAgencyRequest extends FormRequest
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
            'address' => ['required', 'string'],
            'longitude' => ['required'],
            'latitude' => ['required'],
            'agencyable_type' => [
                'required',
                'string',
                'in:App\\Models\\Student,App\\Models\\Teacher',
            ],
            'agencyable_id' => [
                'required',
                'uuid',
                function ($attribute, $value, $fail) {
                    $type = request('agencyable_type');
                    if ($type === 'App\\Models\\Student') {
                        if (!Student::where('id', $value)->exists()) {
                            $fail('The selected student ID is invalid.');
                        }
                    } elseif ($type === 'App\\Models\\Teacher') {
                        if (!Teacher::where('id', $value)->exists()) {
                            $fail('The selected teacher ID is invalid.');
                        }
                    } else {
                        $fail('The selected agencyable type is invalid.');
                    }
                }
            ],
            'status' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama harus diisi.',
            'name.string' => 'Nama harus berupa teks.',
            'name.max' => 'Nama tidak boleh lebih dari 255 karakter.',
            'address.required' => 'Alamat harus diisi.',
            'address.string' => 'Alamat harus berupa teks.',
            'longitude.required' => 'Longitude harus diisi.',
            'latitude.required' => 'Latitude harus diisi.',
            'agencyable_type.required' => 'Tipe agensi harus diisi.',
            'agencyable_type.string' => 'Tipe agensi harus berupa teks.',
            'agencyable_type.in' => 'Tipe agensi tidak valid.',
            'agencyable_id.required' => 'ID agensi harus diisi.',
            'agencyable_id.uuid' => 'Format ID agensi tidak valid.',
            'status.required' => 'Status harus diisi.',
            'status.boolean' => 'Status harus berupa true atau false.',
        ];
    }
}
