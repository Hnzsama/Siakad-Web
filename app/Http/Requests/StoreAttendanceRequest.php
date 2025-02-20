<?php

namespace App\Http\Requests;

use App\Models\School;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAttendanceRequest extends FormRequest
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
            'attendable_type' => [
                'required',
                'string',
                'in:App\\Models\\Student,App\\Models\\Teacher',
            ],
            'attendable_id' => [
                'required',
                'uuid',
                function ($attribute, $value, $fail) {
                    $type = request('attendable_type');
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
            'date' => ['required', 'date'],
            'check_in' => ['nullable', 'date_format:H:i'],
            'check_out' => ['nullable', 'date_format:H:i'],
            'status' => [
                'required',
                'string',
                Rule::in(['Present', 'Late', 'Absent', 'Permission', 'Sick'])
            ],
            'location_latitude' => ['nullable', 'string'],
            'location_longitude' => ['nullable', 'string'],
            'device_info' => ['nullable', 'string'],
            'photo_path' => ['nullable', 'image'],
            'notes' => ['nullable', 'string']
        ];
    }
}
