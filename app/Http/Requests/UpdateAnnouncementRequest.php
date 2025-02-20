<?php

namespace App\Http\Requests;

use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAnnouncementRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'announcement_type' => ['nullable', 'string', 'max:255'],
            'start_date' => ['nullable', 'date_format:Y-m-d'],
            'end_date' => ['nullable', 'date_format:Y-m-d'],
            'is_published' => ['required', 'boolean'],
            'created_by' => ['nullable', 'uuid',
                Rule::exists(User::class, 'id')
            ],
            'target_audience' => ['nullable', 'string', 'max:255'],
            'attachments' => ['nullable', 'array'],
        ];
    }
}
