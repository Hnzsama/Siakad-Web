<?php

namespace App\Http\Requests;

use App\Models\Guardian;
use App\Models\School;
use App\Models\Semester;
use App\Models\Student;
use App\Models\User;
use App\Models\WarningCategory;
use App\Models\WarningLetter;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWarningLetterRequest extends FormRequest
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
            'letter_number' => ['required', 'string',
                Rule::unique(WarningLetter::class, 'letter_number')->ignore($this->warningLetter->id)
            ],
            'student_id' => ['required', 'uuid', Rule::exists(Student::class, 'id')],
            'semester_id' => ['nullable', 'uuid', Rule::exists(Semester::class, 'id')],
            'warning_category_id' => ['required', 'uuid', Rule::exists(WarningCategory::class, 'id')],
            'issued_date' => ['required', 'date_format:Y-m-d'],
            'description' => ['required', 'string'],
            'document_path' => ['nullable', 'string'],

            // Parent/Guardian information
            'parent_received_at' => ['nullable', 'date'],
            'parent_signature_path' => ['nullable', 'string'],

            // Follow up information
            'follow_up_date' => ['nullable', 'date'],
            'follow_up_notes' => ['nullable', 'string'],

            // Cancellation information
            'cancelled_at' => ['nullable', 'date'],
            'cancellation_reason' => ['nullable', 'string'],
            'cancelled_by' => ['nullable', 'uuid', Rule::exists(User::class, 'id')],
            'cancellation_document_path' => ['nullable', 'string'],
            'approved_by' => ['nullable', 'uuid', Rule::exists(User::class, 'id')],

            // Audit trail fields will be handled automatically
            'created_by' => ['nullable', 'uuid', Rule::exists(User::class, 'id')],
            'updated_by' => ['nullable', 'uuid', Rule::exists(User::class, 'id')],

            'status' => ['nullable', 'string', Rule::in(['pending', 'cancelled', 'approved'])],
        ];
    }
}
