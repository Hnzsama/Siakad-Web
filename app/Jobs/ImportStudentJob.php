<?php

namespace App\Jobs;

use App\Models\Guardian;
use App\Models\Semester;
use App\Models\Student;
use App\Service\UserService;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use League\Csv\Reader;

class ImportStudentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $filePath;
    protected $classroomId;
    protected $userId;
    public $tries = 1;
    public $timeout = 300;

    public function __construct(string $filePath, string $classroomId, string $userId)
    {
        $this->filePath = $filePath;
        $this->classroomId = $classroomId;
        $this->userId = $userId;
    }

    public function handle(UserService $userService): void
    {
        try {
            $filePath = storage_path('app/public/' . $this->filePath);
            $csvReader = Reader::createFromPath($filePath, 'r');
            $csvReader->setHeaderOffset(0);

            $requiredHeaders = [
                'name',
                'nik',
                'nis',
                'gender',
                'place_of_birth',
                'date_of_birth',
                'address',
                'phone',
                'email',
                'guardian_email',
                'enrollment_date'
            ];

            $csvHeaders = $csvReader->getHeader();
            $missingHeaders = array_diff($requiredHeaders, $csvHeaders);

            if (!empty($missingHeaders)) {
                throw new \Exception('Missing columns: ' . implode(', ', $missingHeaders));
            }

            $studentRecords = $csvReader->getRecords();
            $activeSemester = Semester::where('status', 'Active')->firstOrFail();

            DB::beginTransaction();
            try {
                foreach ($studentRecords as $rowIndex => $studentData) {
                    $guardianRecord = Guardian::where('email', $studentData['guardian_email'])->first();

                    if (!$guardianRecord) {
                        Log::warning('Guardian not found', ['guardian_email' => $studentData['guardian_email']]);
                        continue; // Skip this student record
                    }

                    try {
                        $dateOfBirth = Carbon::createFromFormat('d/m/Y', $studentData['date_of_birth'])->format('Y-m-d');
                        $enrollmentDate = Carbon::createFromFormat('d/m/Y', $studentData['enrollment_date'])->format('Y-m-d');
                    } catch (\Exception $e) {
                        Log::error('Date conversion error', ['error' => $e->getMessage()]);
                        continue; // Skip this student record
                    }

                    $user = $userService->generateUser(
                        'student',
                        $studentData['name'],
                        $studentData['email'],
                        $studentData['phone'],
                        $dateOfBirth
                    );

                    Student::create([
                        'user_id' => $user->id,
                        'semester_id' => $activeSemester->id,
                        'guardian_id' => $guardianRecord->id,
                        'classroom_id' => $this->classroomId,
                        'name' => $studentData['name'],
                        'nik' => $studentData['nik'],
                        'nis' => $studentData['nis'],
                        'gender' => $studentData['gender'],
                        'place_of_birth' => $studentData['place_of_birth'],
                        'date_of_birth' => $dateOfBirth,
                        'address' => $studentData['address'],
                        'phone' => $studentData['phone'] ?? null,
                        'email' => $studentData['email'],
                        'status' => 'Active',
                        'enrollment_date' => $enrollmentDate,
                        'violation_points' => 100,
                    ]);
                }

                DB::commit();

                DB::table('import_statuses')->insert([
                    'user_id' => $this->userId,
                    'import_type' => 'student',
                    'success' => true,
                    'message' => 'Student import completed successfully.',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } catch (\Exception $error) {
                DB::rollBack();

                DB::table('import_statuses')->insert([
                    'user_id' => $this->userId,
                    'import_type' => 'student',
                    'success' => false,
                    'message' => 'Student import failed',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                throw $error;
            }
        } catch (\Exception $error) {
            Log::error('CSV read error', [
                'file' => $this->filePath,
                'error' => $error->getMessage()
            ]);
            throw $error;
        } finally {
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }
    }

    public function failed(\Throwable $error)
    {
        Log::error('Student import failed', [
            'user_id' => $this->userId,
            'error' => $error->getMessage(),
            'file' => $this->filePath
        ]);
    }
}
