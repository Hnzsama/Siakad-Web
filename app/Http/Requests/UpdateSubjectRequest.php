<?php

namespace App\Http\Requests;

use App\Models\School;
use App\Models\Subject;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSubjectRequest extends FormRequest
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
            'type' => ['required', 'string', 
                Rule::in(['theorical', 'practical'])],
            'code' => ['nullable', 'string', 'max:255',
                Rule::unique(Subject::class)->ignore($this->subject->id)
            ],
            'description' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'boolean']
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Nama mata pelajaran wajib diisi',
            'name.string' => 'Nama mata pelajaran harus berupa teks',
            'name.max' => 'Nama mata pelajaran maksimal 255 karakter',
            'type.required' => 'Tipe mata pelajaran wajib diisi',
            'type.string' => 'Tipe mata pelajaran harus berupa teks',
            'type.in' => 'Tipe mata pelajaran harus theorical atau practical',
            'code.string' => 'Kode mata pelajaran harus berupa teks',
            'code.max' => 'Kode mata pelajaran maksimal 255 karakter',
            'code.unique' => 'Kode mata pelajaran sudah digunakan',
            'description.string' => 'Deskripsi harus berupa teks',
            'description.max' => 'Deskripsi maksimal 255 karakter',
            'status.required' => 'Status wajib diisi',
            'status.boolean' => 'Status harus berupa boolean'
        ];
    }
}
