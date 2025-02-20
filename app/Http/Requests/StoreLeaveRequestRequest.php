<?php

namespace App\Http\Requests;

use App\Models\LeaveType;
use App\Models\School;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLeaveRequestRequest extends FormRequest
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
            'leavable_type' => [
                'required',
                'string',
                'in:App\\Models\\Student,App\\Models\\Teacher',
            ],
            'leavable_id' => [
                'required',
                'uuid',
                function ($attribute, $value, $fail) {
                    $type = request('leavable_type');
                    if ($type === 'App\\Models\\Student') {
                        if (!Student::where('id', $value)->exists()) {
                            $fail('The selected student ID is invalid.');
                        }
                    } elseif ($type === 'App\\Models\\Teacher') {
                        if (!Teacher::where('id', $value)->exists()) {
                            $fail('The selected teacher ID is invalid.');
                        }
                    } else {
                        $fail('The selected agencyable type is invalid.');
                    }
                }
            ],
            'leave_type_id' => ['required', 'uuid',
                Rule::exists(LeaveType::class, 'id')
            ],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date'],
            'reason' => ['required', 'string'],
            'attachment_url' => ['required', 'image', 'max:2048'],
            'status' => ['required', 'string',
                Rule::in(['Pending', 'Approved', 'Rejected'])
            ]
        ];
    }
}
