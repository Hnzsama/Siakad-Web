<?php

namespace App\Http\Requests;

use App\Models\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoleRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255', Rule::unique(Role::class)->ignore($this->role)],
            'guard_name' => ['required', 'string', 'max:255'],
            'permissions' => ['nullable', 'array'],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Nama role wajib diisi',
            'name.string' => 'Nama role harus berupa text',
            'name.max' => 'Nama role maksimal 255 karakter',
            'guard_name.required' => 'Nama penjaga wajib diisi',
            'guard_name.string' => 'Nama penjaga harus berupa text',
            'guard_name.max' => 'Nama penjaga maksimal 255 karakter',
            'permissions.array' => 'Format permissions tidak valid',
        ];
    }
}
