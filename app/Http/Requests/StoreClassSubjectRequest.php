<?php

namespace App\Http\Requests;

use App\Models\Classroom;
use App\Models\ClassSubject;
use App\Models\School;
use App\Models\Semester;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClassSubjectRequest extends FormRequest
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
            'subject_teacher_id' => ['nullable', 'uuid',
                Rule::exists('subject_teacher', 'id'),
                // Rule::unique('class_subjects')
                //     ->where('classroom_id', $this->classroom_id)
            ],
            'classroom_id' => ['nullable', 'uuid',
                Rule::exists(Classroom::class, 'id'),
                // Rule::unique('class_subjects')
                //     ->where('subject_teacher_id', $this->subject_teacher_id)
            ],
            'type' => ['required', 'string',
                Rule::in(['subject', 'break']),
            ],
            'name' => ['nullable', 'string', 'max:255'],
            'day' => ['required', 'string',
                Rule::in(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
            ],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i'],
            'default_duration' => ['nullable', 'numeric'],
            'status' => ['required', 'boolean']
        ];
    }
}
