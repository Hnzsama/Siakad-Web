<?php

namespace App\Http\Requests;

use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSubjectTeacherRequest extends FormRequest
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
            'teacher_id' => ['required', 'uuid',
                Rule::exists(Teacher::class, 'id'),
                Rule::unique('subject_teacher')
                    ->where('subject_id', $this->subject_id)
            ],
            'subject_id' => ['required', 'uuid',
                Rule::exists(Subject::class, 'id'),
                Rule::unique('subject_teacher')
                    ->where('teacher_id', $this->teacher_id)
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'teacher_id.required' => 'Guru harus diisi',
            'teacher_id.uuid' => 'Format ID guru tidak valid',
            'teacher_id.exists' => 'Guru tidak ditemukan',
            'teacher_id.unique' => 'Guru sudah mengajar mata pelajaran ini',
            'subject_id.required' => 'Mata pelajaran harus diisi',
            'subject_id.uuid' => 'Format ID mata pelajaran tidak valid',
            'subject_id.exists' => 'Mata pelajaran tidak ditemukan',
            'subject_id.unique' => 'Mata pelajaran sudah diajar oleh guru ini'
        ];
    }
}
    