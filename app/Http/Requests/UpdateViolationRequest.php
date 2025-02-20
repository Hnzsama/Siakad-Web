<?php

namespace App\Http\Requests;

use App\Models\School;
use App\Models\Semester;
use App\Models\Student;
use App\Models\ViolationType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateViolationRequest extends FormRequest
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
            'student_id' => ['required', 'uuid',
                Rule::exists(Student::class, 'id')
            ],
            'violation_type_id' => ['required', 'uuid',
                Rule::exists(ViolationType::class, 'id')
            ],
            'violation_date' => ['required', 'date'],
            'description' => ['required', 'string'],
            'document_path' => ['nullable', 'string'],
            'sanction_start_date' => ['nullable', 'date'],
            'sanction_end_date' => ['nullable', 'date'],
            'sanction_notes' => ['nullable', '=string'],
            'status' => ['nullable', 'string', 'in:pending,approved,cancelled'],
        ];
    }
}
