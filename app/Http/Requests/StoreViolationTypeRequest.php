<?php

namespace App\Http\Requests;

use App\Models\School;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreViolationTypeRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255', Rule::unique('violation_types', 'name')->where(function ($query) {
            return $query->whereRaw('LOWER(name) = ?', [strtolower($this->name)]);
            })],
            'points' => ['required', 'integer'],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama tipe pelanggaran wajib diisi',
            'name.string' => 'Nama tipe pelanggaran harus berupa teks',
            'name.max' => 'Nama tipe pelanggaran maksimal 255 karakter',
            'name.unique' => 'Nama tipe pelanggaran sudah ada',
            'points.required' => 'Poin pelanggaran wajib diisi',
            'points.integer' => 'Poin pelanggaran harus berupa angka',
            'description.string' => 'Deskripsi harus berupa teks',
            'description.max' => 'Deskripsi maksimal 255 karakter',
        ];
    }
}
