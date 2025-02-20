<?php

namespace App\Http\Requests;

use App\Models\Guardian;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGuardianRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'relationship' => ['required', 'string',
                Rule::in(['Father', 'Mother', 'Guardian', 'Other'])
            ],
            'nik' => ['required', 'string', 'size:16'],
            'phone' => ['required', 'string',
                Rule::unique(Teacher::class, 'phone'),
                Rule::unique(Student::class, 'phone'),
                Rule::unique(Guardian::class, 'phone')->ignore($this->guardian->id),
            ],
            'email' => ['required', 'email',
                Rule::unique(Teacher::class, 'email'),
                Rule::unique(Student::class, 'email'),
                Rule::unique(Guardian::class, 'email')->ignore($this->guardian->id),
            ],
            'date_of_birth' => ['required', 'date'],
            'address' => ['required', 'string'],
            'gender' => ['required', 'string',
                Rule::in(['Male', 'Female'])
            ],
            'occupation' => ['nullable', 'string', 'max:255'],
            'income' => ['nullable', 'numeric'],
            'status' => ['required', 'boolean']
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi',
            'name.string' => 'Nama harus berupa teks',
            'name.max' => 'Nama tidak boleh lebih dari 255 karakter',
            
            'relationship.required' => 'Hubungan wajib diisi',
            'relationship.string' => 'Hubungan harus berupa teks',
            'relationship.in' => 'Hubungan harus Ayah, Ibu, Wali atau Lainnya',
            
            'nik.required' => 'NIK wajib diisi',
            'nik.string' => 'NIK harus berupa teks',
            'nik.size' => 'NIK harus 16 karakter',
            
            'phone.required' => 'Nomor telepon wajib diisi',
            'phone.string' => 'Nomor telepon harus berupa teks',
            'phone.unique' => 'Nomor telepon sudah terdaftar',
            
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah terdaftar',
            
            'date_of_birth.required' => 'Tanggal lahir wajib diisi',
            'date_of_birth.date' => 'Format tanggal tidak valid',
            
            'address.required' => 'Alamat wajib diisi',
            'address.string' => 'Alamat harus berupa teks',
            
            'gender.required' => 'Jenis kelamin wajib diisi',
            'gender.string' => 'Jenis kelamin harus berupa teks',
            'gender.in' => 'Jenis kelamin harus Laki-laki atau Perempuan',
            
            'occupation.string' => 'Pekerjaan harus berupa teks',
            'occupation.max' => 'Pekerjaan tidak boleh lebih dari 255 karakter',
            
            'income.numeric' => 'Penghasilan harus berupa angka',
            
            'status.required' => 'Status wajib diisi',
            'status.boolean' => 'Status harus berupa benar atau salah'
        ];
    }
}
