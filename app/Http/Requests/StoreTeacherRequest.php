<?php

namespace App\Http\Requests;

use App\Models\Guardian;
use App\Models\School;
use App\Models\Shift;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTeacherRequest extends FormRequest
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
            'shift_id' => ['required', 'uuid',
                Rule::exists(Shift::class, 'id')
            ],
            'name' => ['required', 'string', 'max:255'],
            'nip' => ['required', 'string', 'max:255',
                Rule::unique(Teacher::class)
            ],
            'gender' => ['required', 'string',
                Rule::in(['Male', 'Female'])
            ],
            'place_of_birth' => ['required', 'string', 'max:255'],
            'date_of_birth' => ['required', 'date'],
            'highest_education' => ['nullable', 'string', 'max:255'],
            'major' => ['nullable', 'string', 'max:255'],
            'university' => ['nullable', 'string', 'max:255'],
            'certification' => ['nullable', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'phone' => ['nullable', 'string', 'max:255',
                Rule::unique(Teacher::class),
                Rule::unique(Student::class, 'phone'),
                Rule::unique(Guardian::class, 'phone'),
                Rule::unique(User::class, 'phone')
            ],
            'email' => ['required', 'email',
                Rule::unique(Teacher::class),
                Rule::unique(Student::class, 'email'),
                Rule::unique(Guardian::class, 'email'),
                Rule::unique(User::class, 'email')
            ],
            'position' => ['nullable', 'string', 'max:255'],
            'subject' => ['nullable', 'string', 'max:255'],
            'year_started' => ['required', 'date_format:Y'],
            'year_ended' => ['nullable', 'date_format:Y'],
            'work_experience' => ['nullable', 'string'],
            'status' => ['required', 'boolean']
        ];
    }

    public function messages(): array
    {
        return [
            'shift_id.required' => 'Kolom shift wajib diisi.',
            'shift_id.uuid' => 'Kolom shift harus berupa uuid valid',
            'shift_id.exists' => 'Shift yang dipilih tidak valid.',
            'name.required' => 'Kolom nama wajib diisi.',
            'name.string' => 'Kolom nama harus berupa teks.',
            'name.max' => 'Kolom nama tidak boleh lebih dari 255 karakter.',
            'nip.required' => 'Kolom NIP wajib diisi.',
            'nip.string' => 'Kolom NIP harus berupa teks.',
            'nip.max' => 'Kolom NIP tidak boleh lebih dari 255 karakter.',
            'nip.unique' => 'NIP tersebut sudah digunakan.',
            'gender.required' => 'Kolom jenis kelamin wajib diisi.',
            'gender.string' => 'Kolom jenis kelamin harus berupa teks.',
            'gender.in' => 'Jenis kelamin harus Male atau Female.',
            'place_of_birth.required' => 'Kolom tempat lahir wajib diisi.',
            'date_of_birth.required' => 'Kolom tanggal lahir wajib diisi.',
            'date_of_birth.date' => 'Format tanggal lahir tidak valid.',
            'phone.unique' => 'Nomor telepon tersebut sudah digunakan.',
            'email.required' => 'Kolom email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email tersebut sudah digunakan.',
            'year_started.required' => 'Kolom tahun mulai wajib diisi.',
            'year_started.date_format' => 'Format tahun mulai tidak valid.',
            'year_ended.date_format' => 'Format tahun selesai tidak valid.',
            'status.required' => 'Kolom status wajib diisi.',
            'status.boolean' => 'Kolom status harus berupa boolean.'
        ];
    }
}
