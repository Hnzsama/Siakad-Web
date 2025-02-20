<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agency;
use App\Models\Attendance;
use App\Models\AttendanceSetting;
use App\Models\Schedule;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as RoutingController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use phpDocumentor\Reflection\Types\Boolean;

class AttendanceController extends RoutingController
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $request->validate([
                'attendable_type' => [
                    'required',
                    'string',
                    'in:App\\Models\\Student,App\\Models\\Teacher',
                ],
                'attendable_id' => [
                    'required',
                    'uuid',
                    function ($attribute, $value, $fail) {
                        $type = request('attendable_type');
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
            ]);

            $isStudent = $request->attendable_type === 'App\\Models\\Student';
            $isTeacher = $request->attendable_type === 'App\\Models\\Teacher';

            if ($isStudent) {
                $student = Student::with('classroom')->find($request->attendable_id);
                $schedules = Schedule::query()->where('shift_id', $student->classroom->shift_id)->get();
                $agencies = Agency::query()->where('agencyable_id', $student->id)->get();
            } else {
                $teacher = Teacher::find($request->attendable_id);
                $schedules = Schedule::query()->where('shift_id', $teacher->shift_id)->get();
                $agencies = Agency::query()->where('agencyable_id', $teacher->id)->get();
            }

            $attendanceSetting = AttendanceSetting::query()->first();

            $startOfWeek = Carbon::now()->startOfWeek();
            $endOfWeek = Carbon::now()->endOfWeek();

            $attendances = Attendance::where('attendable_type', $request->attendable_type)
                ->where('attendable_id', $request->attendable_id)
                ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
                ->orderBy('created_at', 'asc')
                ->get();

            return response()->json([
                'currentTime' => Carbon::now('Asia/Jakarta')->format('Y-m-d H:i:s'),
                'attendances' => $attendances,
                'schedules' => $schedules,
                'agencies' => $agencies,
                'attendance_setting' => $attendanceSetting
            ]);
        } catch (ValidationException $e) {
            return response()->json($e->errors(), 422);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Check for duplicate check-in attendance
     *
     * @param string $attendableType
     * @param string $attendableId
     * @param string $date
     * @return void
     * @throws \Exception
     */
    private function validateCheckIn(string $attendableType, string $attendableId, string $date): void
    {
        $existingAttendance = Attendance::query()
            ->where('attendable_type', $attendableType)
            ->where('attendable_id', $attendableId)
            ->whereDate('date', $date)
            ->whereNotNull('check_in')
            ->first();

        if ($existingAttendance) {
            throw new \Exception('Anda sudah melakukan check in hari ini');
        }
    }

    /**
     * Validate and get existing attendance for check-out
     *
     * @param string $attendableType
     * @param string $attendableId
     * @param string $date
     * @return Attendance
     * @throws \Exception
     */
    private function validateCheckOut(string $attendableType, string $attendableId, string $date): Attendance
    {
        $existingAttendance = Attendance::query()
            ->where('attendable_type', $attendableType)
            ->where('attendable_id', $attendableId)
            ->whereDate('date', $date)
            ->first();

        if (!$existingAttendance) {
            throw new \Exception('Anda belum melakukan check in hari ini');
        }

        if ($existingAttendance->check_out) {
            throw new \Exception('Anda sudah melakukan check out hari ini');
        }

        return $existingAttendance;
    }

    public function store(Request $request)
    {
        try {
            $attendanceSetting = AttendanceSetting::query()->first();
            if (!$attendanceSetting) {
                throw new \Exception('Absensi sedang tidak aktif');
            }

            $isLocationBased = $attendanceSetting->allow_location_based;

            // Validation rules
            $validationRules = [
                'attendable_type' => [
                    'required',
                    'string',
                    'in:App\\Models\\Student,App\\Models\\Teacher',
                ],
                'attendable_id' => [
                    'required',
                    'uuid',
                    function ($attribute, $value, $fail) {
                        $type = request('attendable_type');
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
                'date' => ['required', 'date'],
                'location_latitude' => $isLocationBased ? ['required', 'string'] : ['nullable', 'string'],
                'location_longitude' => $isLocationBased ? ['required', 'string'] : ['nullable', 'string'],
                'device_info' => ['nullable', 'string'],
                'photo_path' => ['required', 'image'],
                'notes' => ['nullable', 'string']
            ];

            $validatedData = $request->validate($validationRules);

            // Get user
            $user = User::query()
                ->whereHas('student', function ($query) use ($validatedData) {
                    $query->where('id', $validatedData['attendable_id']);
                })
                ->orWhereHas('teacher', function ($query) use ($validatedData) {
                    $query->where('id', $validatedData['attendable_id']);
                })
                ->first();
            assert($user instanceof User);

            DB::beginTransaction();

            // Handle photo upload
            if ($validatedData['photo_path']) {
                $extension = $validatedData['photo_path']->getClientOriginalExtension();
                $fileName = Str::uuid() . '.' . $extension;
                $photoPath = $validatedData['photo_path']->storeAs('attendances', $fileName);
                $validatedData['photo_path'] = $photoPath;
            }

            // Time setup
            $currentTime = Carbon::now('Asia/Jakarta');
            // statis
            // $currentTime = Carbon::createFromFormat('H:i:s', '14:30:00', 'Asia/Jakarta');
            $requestDate = Carbon::parse($request->date)->setTimezone('Asia/Jakarta');
            $dayName = strtolower($requestDate->format('l'));

            // Get schedules based on user role
            if ($user->hasRole('teacher')) {
                $schedules = Schedule::query()
                    ->where('shift_id', $user->teacher->shift_id)
                    ->where('day', $dayName)
                    ->first();
            } else if ($user->hasRole('student')) {
                $student = Student::with('classroom')->find($user->student->id);
                $schedules = Schedule::query()
                    ->where('shift_id', $student->classroom->shift_id)
                    ->where('day', $dayName)
                    ->first();
            }

            // return response()->json($request->date);

            if (!$schedules) {
                throw new \Exception('Tidak ada jadwal untuk hari ini');
            }

            $startTime = Carbon::createFromFormat('H:i:s', $schedules->start_time, 'Asia/Jakarta');
            $endTime = Carbon::createFromFormat('H:i:s', $schedules->end_time, 'Asia/Jakarta');
            $twoHoursBefore = $startTime->copy()->subHours(2);
            $currentTimeObj = Carbon::parse($currentTime->format('H:i'), 'Asia/Jakarta');
            $midnight = Carbon::parse('23:59:59', 'Asia/Jakarta');

            $existingAttendance = Attendance::where([
                'attendable_type' => $validatedData['attendable_type'],
                'attendable_id' => $validatedData['attendable_id'],
                'date' => $validatedData['date'],
            ])->first();

            $attendance = null;
            $semester = Semester::query()->where('status', true)->first();
            $validatedData['semester_id'] = $semester->id;

            // Check-in period (2 hours before start until end time)
            if ($currentTimeObj->between($twoHoursBefore, $endTime)) {
                if ($existingAttendance) {
                    throw new \Exception('Sudah melakukan absensi hari ini');
                }

                $validatedData['check_in'] = $currentTimeObj->format('H:i');
                $validatedData['status'] = $currentTimeObj->between($twoHoursBefore, $startTime)
                    ? 'Present'
                    : 'Late';

                $attendance = Attendance::create($validatedData);
                $message = 'Absen masuk berhasil';
            }
            // Check-out period (after end time until midnight)
            else if ($currentTimeObj->between($endTime, $midnight)) {
                if ($existingAttendance) {
                    if ($existingAttendance->check_out) {
                        throw new \Exception('Sudah melakukan absen pulang hari ini');
                    }

                    $existingAttendance->check_out = $currentTimeObj->format('H:i');
                    $existingAttendance->save();
                    $attendance = $existingAttendance;
                    $message = 'Absen pulang berhasil';
                } else {
                    // Auto create check-in and check-out
                    $validatedData['check_in'] = $currentTimeObj->format('H:i');
                    $validatedData['check_out'] = $currentTimeObj->format('H:i');
                    $validatedData['status'] = 'Late';

                    $attendance = Attendance::create($validatedData);
                    $message = 'Auto absen masuk dan pulang berhasil';
                }
            } else {
                throw new \Exception('Diluar waktu absensi yang diizinkan');
            }

            DB::commit();

            return response()->json([
                'message' => $message,
                'data' => $attendance,
                'attendance_time' => $currentTimeObj->format('H:i'),
                'attendance_type' => $currentTimeObj->between($twoHoursBefore, $endTime) ? 'check_in' : 'check_out',
                'is_auto_recorded' => !$existingAttendance && $currentTimeObj->between($endTime, $midnight)
            ], 201);
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Attendance $attendance)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Attendance $attendance)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendance $attendance)
    {
        //
    }
}
