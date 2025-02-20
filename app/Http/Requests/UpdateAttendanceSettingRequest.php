<?php

namespace App\Http\Requests;

use App\Models\School;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAttendanceSettingRequest extends FormRequest
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
            'allow_location_based' => ['required', 'boolean'],
            'allowed_radius' => ['required_if:allow_location_based,true']
        ];
    }

    public function messages(): array
    {
        return [
            'allow_location_based.required' => 'Status lokasi wajib diisi',
            'allow_location_based.boolean' => 'Status lokasi harus berupa boolean',
            'allowed_radius.required_if' => 'Radius wajib diisi jika status lokasi aktif'
        ];
    }
}
