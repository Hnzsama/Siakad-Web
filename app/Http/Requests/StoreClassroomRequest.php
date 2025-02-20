<?php

namespace App\Http\Requests;

use App\Models\ClassLevel;
use App\Models\Classroom;
use App\Models\Major;
use App\Models\School;
use App\Models\Shift;
use App\Models\StudyGroup;
use App\Models\Teacher;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClassroomRequest extends FormRequest
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
                Rule::unique(Classroom::class)
            ],
            'class_level_id' => ['required', 'uuid',
                Rule::exists(ClassLevel::class, 'id')
            ],
            'study_group_id' => ['required', 'uuid',
                Rule::exists(StudyGroup::class, 'id'),
            ],
            'shift_id' => ['required', 'uuid',
                Rule::exists(Shift::class, 'id'),
            ],
            'major_id' => ['nullable', 'uuid',
                Rule::exists(Major::class, 'id'),
            ],
            'room_number' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'boolean']
        ];
    }

    public function messages(): array
    {
        return [
            'teacher_id.required' => 'Kolom guru wajib diisi.',
            'teacher_id.uuid' => 'Format ID guru tidak valid.',
            'teacher_id.exists' => 'Guru yang dipilih tidak ditemukan.',
            'teacher_id.unique' => 'Guru ini sudah ditugaskan ke kelas lain.',
            'class_level_id.required' => 'Kolom tingkat kelas wajib diisi.',
            'class_level_id.uuid' => 'Format ID tingkat kelas tidak valid.',
            'class_level_id.exists' => 'Tingkat kelas yang dipilih tidak ditemukan.',
            'study_group_id.required' => 'Kolom rombongan belajar wajib diisi.',
            'study_group_id.uuid' => 'Format ID rombongan belajar tidak valid.',
            'study_group_id.exists' => 'Rombongan belajar yang dipilih tidak ditemukan.',
            'shift_id.required' => 'Kolom shift wajib diisi.',
            'shift_id.uuid' => 'Format ID shift tidak valid.',
            'shift_id.exists' => 'Shift yang dipilih tidak ditemukan.',
            'major_id.uuid' => 'Format ID jurusan tidak valid.',
            'major_id.exists' => 'Jurusan yang dipilih tidak ditemukan.',
            'room_number.string' => 'Nomor ruangan harus berupa teks.',
            'room_number.max' => 'Nomor ruangan tidak boleh lebih dari 255 karakter.',
            'status.required' => 'Status wajib diisi.',
            'status.boolean' => 'Status harus berupa true atau false.'
        ];
    }
}
