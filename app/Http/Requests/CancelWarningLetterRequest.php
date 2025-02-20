<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CancelWarningLetterRequest extends FormRequest
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
            'cancellation_document_path' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'cancelled_at.required' => 'Tanggal pembatalan wajib diisi',
            'cancelled_at.date' => 'Format tanggal pembatalan tidak valid',
            'cancellation_reason.required' => 'Alasan pembatalan wajib diisi',
            'cancellation_reason.string' => 'Alasan pembatalan harus berupa teks',
            'cancellation_document_path.string' => 'Path dokumen pembatalan harus berupa teks',
        ];
    }
}
