<?php

namespace App\Http\Requests;

use App\Models\Classroom;
use App\Models\Guardian;
use App\Models\School;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStudentRequest extends FormRequest
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
            'semester_id' => ['nullable', 'uuid',
                Rule::exists(Semester::class, 'id')
            ],
            'guardian_id' => ['required', 'uuid',
                Rule::exists(Guardian::class, 'id')
            ],
            'name' => ['required', 'string', 'max:255'],
            'nik' => ['required', 'string', 'size:16',
                Rule::unique(Student::class, 'nik'),
                Rule::unique(Guardian::class, 'nik'),
            ],
            'nis' => ['required', 'string',
                Rule::unique(Student::class),
            ],
            'gender' => ['required', 'string',
                Rule::in(['Male', 'Female'])
            ],
            'place_of_birth' => ['required', 'string', 'max:255'],
            'date_of_birth' => ['required', 'date'],
            'address' => ['required', 'string'],
            'phone' => ['nullable', 'string', 'max:255',
                Rule::unique(Teacher::class, 'phone'),
                Rule::unique(Student::class, 'phone'),
                Rule::unique(Guardian::class, 'phone'),
                Rule::unique(User::class, 'phone')
            ],
            'email' => ['required', 'email',
                Rule::unique(Teacher::class, 'email'),
                Rule::unique(Student::class, 'email'),
                Rule::unique(Guardian::class, 'email'),
                Rule::unique(User::class, 'email')
            ],
            'status' => ['required', 'string',
                Rule::in(['Active', 'Graduated', 'Dropped Out'])
            ],
            'enrollment_date' => ['required', 'date'],
            'graduation_date' => ['nullable', 'date'],
            'violation_point' => ['nullable', 'numeric'],
            'classroom_id' => ['required', 'uuid',
                Rule::exists(Classroom::class, 'id')
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'semester_id.uuid' => 'ID semester harus berupa UUID',
            'semester_id.exists' => 'Semester tidak ditemukan',
            
            'guardian_id.required' => 'Wali murid wajib diisi',
            'guardian_id.uuid' => 'ID wali murid harus berupa UUID',
            'guardian_id.exists' => 'Wali murid tidak ditemukan',
            
            'name.required' => 'Nama wajib diisi',
            'name.string' => 'Nama harus berupa teks',
            'name.max' => 'Nama maksimal 255 karakter',
            
            'nik.required' => 'NIK wajib diisi',
            'nik.string' => 'NIK harus berupa teks',
            'nik.size' => 'NIK harus 16 digit',
            'nik.unique' => 'NIK sudah digunakan',
            
            'nis.required' => 'NIS wajib diisi',
            'nis.string' => 'NIS harus berupa teks',
            'nis.unique' => 'NIS sudah digunakan',
            
            'gender.required' => 'Jenis kelamin wajib diisi',
            'gender.string' => 'Jenis kelamin harus berupa teks',
            'gender.in' => 'Jenis kelamin harus Male atau Female',
            
            'place_of_birth.required' => 'Tempat lahir wajib diisi',
            'place_of_birth.string' => 'Tempat lahir harus berupa teks',
            'place_of_birth.max' => 'Tempat lahir maksimal 255 karakter',
            
            'date_of_birth.required' => 'Tanggal lahir wajib diisi',
            'date_of_birth.date' => 'Format tanggal lahir tidak valid',
            
            'address.required' => 'Alamat wajib diisi',
            'address.string' => 'Alamat harus berupa teks',
            
            'phone.string' => 'Nomor telepon harus berupa teks',
            'phone.max' => 'Nomor telepon maksimal 255 karakter',
            'phone.unique' => 'Nomor telepon sudah digunakan',
            
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah digunakan',
            
            'status.required' => 'Status wajib diisi',
            'status.string' => 'Status harus berupa teks',
            'status.in' => 'Status harus Active, Graduated, atau Dropped Out',
            
            'enrollment_date.required' => 'Tanggal masuk wajib diisi',
            'enrollment_date.date' => 'Format tanggal masuk tidak valid',
            
            'graduation_date.date' => 'Format tanggal lulus tidak valid',
            
            'violation_point.numeric' => 'Poin pelanggaran harus berupa angka',
            
            'classroom_id.required' => 'Kelas wajib diisi',
            'classroom_id.uuid' => 'ID kelas harus berupa UUID',
            'classroom_id.exists' => 'Kelas tidak ditemukan'
        ];
    }
}
