<?php

namespace App\Http\Requests;

use App\Models\ClassLevel;
use App\Models\School;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClassLevelRequest extends FormRequest
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
            'alphabet' => ['required', 'string', 'max:255'],
            'level' => ['required', 'integer', 'min:0',
                Rule::unique(ClassLevel::class, 'level')
            ],
        ];
    }

    public function messages()
    {
        return [
            'alphabet.required' => 'Kolom alphabet wajib diisi.',
            'alphabet.string' => 'Kolom alphabet harus berupa teks.',
            'alphabet.max' => 'Kolom alphabet tidak boleh lebih dari 255 karakter.',
            'level.required' => 'Kolom tingkat wajib diisi.',
            'level.integer' => 'Kolom tingkat harus berupa angka.',
            'level.min' => 'Kolom tingkat tidak boleh kurang dari 0.',
            'level.unique' => 'Tingkat tersebut sudah digunakan.'
        ];
    }
}
