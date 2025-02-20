<?php

namespace App\Http\Requests;

use App\Models\Schedule;
use App\Models\School;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateScheduleRequest extends FormRequest
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
            'shift_id' => ['required', 'exists:shifts,id'],
            'day' => [
                'required',
                'string',
                Rule::in(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
                Rule::unique('schedules')
                    ->where('shift_id', $this->shift_id)
                    ->ignore($this->schedule->id),
            ],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'entry_grace_period' => ['nullable', 'date_format:H:i'],
            'exit_grace_period' => ['nullable', 'date_format:H:i'],
            'status' => ['boolean'],
        ];
    }
}
