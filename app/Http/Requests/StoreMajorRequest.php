<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMajorRequest extends FormRequest
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
            'status' => ['required', 'boolean']
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Kolom nama wajib diisi.',
            'name.string' => 'Kolom nama harus berupa teks.',
            'name.max' => 'Kolom nama tidak boleh lebih dari 255 karakter.',
            'status.required' => 'Kolom status wajib diisi.',
            'status.boolean' => 'Kolom status harus berupa boolean.'
        ];
    }
}
