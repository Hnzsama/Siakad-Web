<?php

namespace App\Http\Requests;

use App\Models\Province;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRegencyRequest extends FormRequest
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
            'province_code' => ['required', 'numeric',
                Rule::exists(Province::class, 'code')
            ],
            'code' => ['required', 'numeric',
                Rule::unique('regencies')->ignore($this->code)
            ],
            'name' => ['required', 'string', 'max:255']
        ];
    }
}
