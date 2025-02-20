<?php

namespace App\Http\Requests;

use App\Models\District;
use App\Models\Regency;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDistrictRequest extends FormRequest
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
            'regency_code' => ['required', 'numeric',
                Rule::exists(Regency::class, 'code')
            ],
            'code' => ['required', 'numeric',
                Rule::unique(District::class)->ignore($this->code)
            ],
            'name' => ['required', 'string', 'max:255']
        ];
    }
}
