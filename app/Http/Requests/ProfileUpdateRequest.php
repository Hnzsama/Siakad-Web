<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\Guardian;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = Auth::user();
        assert($user instanceof User);

        Log::info('User role check:', [
            'user_id' => $user->id,
            'is_student' => $user->hasRole('student'),
            'is_teacher' => $user->hasRole('teacher'),
            'is_guardian' => $user->hasRole('guardian')
        ]);

        $messages = [
            'required' => ':attribute wajib diisi.',
            'string' => ':attribute harus berupa teks.',
            'max' => ':attribute tidak boleh lebih dari :max karakter.',
            'email' => ':attribute harus berupa alamat email yang valid.',
            'date' => ':attribute harus berupa tanggal yang valid.',
            'numeric' => ':attribute harus berupa angka.',
            'boolean' => ':attribute harus berupa nilai benar atau salah.',
            'size' => ':attribute harus :size karakter.',
            'unique' => ':attribute sudah digunakan.',
            'date_format' => ':attribute harus dalam format :format.',
            'in' => ':attribute yang dipilih tidak valid.'
        ];

        $attributes = [];

        if ($user->hasRole('student')) {
            $attributes = [
                'name' => 'Nama',
                'nik' => 'NIK',
                'gender' => 'Jenis Kelamin',
                'place_of_birth' => 'Tempat Lahir',
                'date_of_birth' => 'Tanggal Lahir',
                'address' => 'Alamat',
                'phone' => 'Nomor Telepon',
                'email' => 'Email',
                'status' => 'Status'
            ];

            return [
                'name' => ['required', 'string', 'max:255'],
                'nik' => ['required', 'string', 'size:16',
                    Rule::unique(Student::class, 'nik')->ignore($user->student->id),
                    Rule::unique(Guardian::class, 'nik'),
                ],
                'gender' => ['required', 'string', Rule::in(['Male', 'Female'])],
                'place_of_birth' => ['required', 'string', 'max:255'],
                'date_of_birth' => ['required', 'date'],
                'address' => ['required', 'string'],
                'phone' => ['nullable', 'string', 'max:255',
                    Rule::unique(Teacher::class, 'phone'),
                    Rule::unique(Student::class, 'phone')->ignore($user->student->id),
                    Rule::unique(Guardian::class, 'phone')
                ],
                'email' => ['required', 'email',
                    Rule::unique(Teacher::class, 'email'),
                    Rule::unique(Student::class, 'email')->ignore($user->student->id),
                    Rule::unique(Guardian::class, 'email'),
                ],
                'status' => ['required', 'string', Rule::in(['Active', 'Graduated', 'Dropped Out'])]
            ];
        }

        if ($user->hasRole('teacher')) {
            $attributes = [
                'name' => 'Nama',
                'nip' => 'NIP',
                'gender' => 'Jenis Kelamin',
                'place_of_birth' => 'Tempat Lahir',
                'date_of_birth' => 'Tanggal Lahir',
                'highest_education' => 'Pendidikan Terakhir',
                'major' => 'Jurusan',
                'university' => 'Universitas',
                'certification' => 'Sertifikasi',
                'address' => 'Alamat',
                'phone' => 'Nomor Telepon',
                'email' => 'Email',
                'position' => 'Jabatan',
                'subject' => 'Mata Pelajaran',
                'year_started' => 'Tahun Mulai',
                'year_ended' => 'Tahun Selesai',
                'work_experience' => 'Pengalaman Kerja',
                'status' => 'Status'
            ];

            return [
                'name' => ['required', 'string', 'max:255'],
                'nip' => ['required', 'string', 'max:255'],
                'gender' => ['required', 'string', Rule::in(['Male', 'Female'])],
                'place_of_birth' => ['required', 'string', 'max:255'],
                'date_of_birth' => ['required', 'date'],
                'highest_education' => ['nullable', 'string', 'max:255'],
                'major' => ['nullable', 'string', 'max:255'],
                'university' => ['nullable', 'string', 'max:255'],
                'certification' => ['nullable', 'string', 'max:255'],
                'address' => ['required', 'string'],
                'phone' => ['nullable', 'string', 'max:255',
                    Rule::unique(Teacher::class)->ignore($user->teacher->id),
                    Rule::unique(Student::class, 'phone'),
                    Rule::unique(Guardian::class, 'phone')
                ],
                'email' => ['required', 'email',
                    Rule::unique(Teacher::class)->ignore($user->teacher->id),
                    Rule::unique(Student::class, 'email'),
                    Rule::unique(Guardian::class, 'email'),
                ],
                'position' => ['nullable', 'string', 'max:255'],
                'subject' => ['nullable', 'string', 'max:255'],
                'year_started' => ['required', 'date_format:Y'],
                'year_ended' => ['nullable', 'date_format:Y'],
                'work_experience' => ['nullable', 'string'],
                'status' => ['required', 'boolean']
            ];
        }

        if ($user->hasRole('guardian')) {
            $attributes = [
                'name' => 'Nama',
                'relationship' => 'Hubungan',
                'nik' => 'NIK',
                'date_of_birth' => 'Tanggal Lahir',
                'address' => 'Alamat',
                'phone' => 'Nomor Telepon',
                'email' => 'Email',
                'gender' => 'Jenis Kelamin',
                'occupation' => 'Pekerjaan',
                'income' => 'Penghasilan',
                'status' => 'Status'
            ];

            return [
                'name' => ['required', 'string', 'max:255'],
                'relationship' => ['required', 'string', Rule::in(['Father', 'Mother', 'Guardian', 'Other'])],
                'nik' => ['required', 'string', 'size:16',
                    Rule::unique(Student::class, 'nik'),
                    Rule::unique(Guardian::class, 'nik')->ignore($user->guardian->id),
                ],
                'date_of_birth' => ['required', 'date'],
                'address' => ['required', 'string'],
                'phone' => ['required', 'string',
                    Rule::unique(Teacher::class, 'phone'),
                    Rule::unique(Student::class, 'phone'),
                    Rule::unique(Guardian::class, 'phone')->ignore($user->guardian->id),
                ],
                'email' => ['required', 'email',
                    Rule::unique(Teacher::class, 'phone'),
                    Rule::unique(Student::class, 'email'),
                    Rule::unique(Guardian::class, 'email')->ignore($user->guardian->id),
                ],
                'gender' => ['required', 'string', Rule::in(['Male', 'Female'])],
                'occupation' => ['nullable', 'string', 'max:255'],
                'income' => ['nullable', 'numeric'],
                'status' => ['required', 'boolean']
            ];
        }

        return [];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return $attributes ?? [];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return $messages ?? [];
    }
}
