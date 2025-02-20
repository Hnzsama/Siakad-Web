<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CancelViolationRequest extends FormRequest
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
            'cancelled_at' => ['required', 'date'],
            'cancellation_reason' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'cancelled_at.required' => 'Tanggal pembatalan harus diisi',
            'cancelled_at.date' => 'Format tanggal pembatalan tidak valid',
            'cancellation_reason.required' => 'Alasan pembatalan harus diisi',
            'cancellation_reason.string' => 'Alasan pembatalan harus berupa teks',
        ];
    }
}
