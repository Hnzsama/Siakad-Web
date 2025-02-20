<?php

namespace App\Http\Requests;

use App\Models\School;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAttendanceRequest extends FormRequest
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
            'attenable' => ['required', 'uuid',
                function ($attribute, $value, $fail) {
                    $studentExists = Student::where('id', $value)->exists();
                    $teacherExists = Teacher::where('id', $value)->exists();

                    if (!$studentExists && !$teacherExists) {
                        $fail('The selected ID must exist in students or teachers table.');
                    }
                }
            ],
            'semester_id' => ['required', 'uuid',
                Rule::exists(Semester::class, 'id')
            ],
            'date' => ['required', 'date'],
            'check_in' => ['nullable', 'date_format:H:i'],
            'check_out' => ['nullable', 'date_format:H:i'],
            'status' => ['required', 'string',
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
