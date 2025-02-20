<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RejectLeaveRequestRequest extends FormRequest
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
            'rejected_at' => ['required', 'date'],
            'rejection_reason' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'rejected_at.required' => 'Tanggal penolakan wajib diisi',
            'rejected_at.date' => 'Format tanggal penolakan tidak valid',
            'rejection_reason.required' => 'Alasan penolakan wajib diisi',
            'rejection_reason.string' => 'Alasan penolakan harus berupa teks',
        ];
    }
}
