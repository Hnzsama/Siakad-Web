<?php

namespace Database\Seeders;

use App\Models\Agency;
use App\Models\Announcement;
use App\Models\Attendance;
use App\Models\AttendanceSetting;
use App\Models\Biometric;
use App\Models\ClassLevel;
use App\Models\Classroom;
use App\Models\ClassSubject;
use App\Models\District;
use App\Models\Guardian;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\Major;
use App\Models\Province;
use App\Models\Schedule;
use App\Models\School;
use App\Models\Semester;
use App\Models\Shift;
use App\Models\Student;
use App\Models\StudentHistory;
use App\Models\StudyGroup;
use App\Models\Subject;
use App\Models\SubjectTeacher;
use App\Models\Teacher;
use App\Models\User;
use App\Models\Violation;
use App\Models\ViolationType;
use App\Models\WarningCategory;
use App\Models\WarningLetter;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ProvinceSeeder::class,
            RegencySeeder::class,
            // DistrictSeeder::class,
        ]);
        School::factory()->create();
        // Semester::factory(100)->create();
        $this->call([
            SemesterSeeder::class
        ]);

        User::factory()->create([
            'name' => 'Hnzsama',
            'email' => 'hnzsama@gmail.com',
            'password' => bcrypt('12345678')
        ]);

        $this->call([
            RoleSeeder::class
        ]);

        $this->call([
            ShiftSeeder::class,
            TeacherSeeder::class,
            GuardianSeeder::class
        ]);

        $this->call([
            MajorSeeder::class,
            StudyGroupSeeder::class,
            ClassLevelSeeder::class,
            ClassroomSeeder::class,
        ]);
        // Subject::factory(100)->create();
        $this->call([
            SubjectSeeder::class,
            StudentSeeder::class
        ]);
        Student::factory(50)->create();
        // StudentHistory::factory(100)->create();
        // Agency::factory(10)->create();
        $this->call([
            AssignAgenciesSeeder::class
        ]);
        SubjectTeacher::factory(10)->create();
        $this->call([
            ClassSubjectSeeder::class
        ]);
        // ClassSubject::factory(50)->create();
        AttendanceSetting::factory(1)->create();
        // $this->call([
        //     ScheduleSeeder::class
        // ]);
        // Schedule::factory()->resetSequence();
        $this->call([
            ScheduleSeeder::class
        ]);
        // Schedule::factory()->count(count(Shift::all()) * 7)->create();
        Attendance::factory(100)->create();
        $this->call([
            // AttendanceSeeder::class,
            WarningCategorySeeder::class
        ]);
        WarningLetter::factory(100)->create();
        $this->call([
            LeaveTypeSeeder::class
        ]);
        LeaveRequest::factory(100)->create();
        $this->call([
            ViolationTypeSeeder::class
        ]);
        Violation::factory(100)->create();
        // Announcement::factory(100)->create();
    }

    private function seedTeachers(): void
    {
        // // Create base teachers
        // Teacher::factory(30)->create();

        // // Create certified teachers
        // Teacher::factory(20)
        //     ->certified()
        //     ->create();

        // // Create senior teachers (some active, some inactive)
        // Teacher::factory(15)
        //     ->senior()
        //     ->state(fn (array $attributes) => [
        //         'status' => fake()->boolean(70) // 70% active
        //     ])
        //     ->create();

        // Create inactive teachers
        Teacher::factory(100)
            ->inactive()
            ->create();
    }

    private function seedGuardians(): void
    {
        // Create base guardians
        Guardian::factory(30)->create();

        // // Create guardians with high income
        // Guardian::factory(20)
        //     ->highIncome()
        //     ->create();

        // // Create fathers only
        // Guardian::factory(15)
        //     ->father()
        //     ->state(fn(array $attributes) => [
        //         'status' => fake()->boolean(80), // 80% chance of being active
        //     ])
        //     ->create();

        // // Create inactive guardians
        // Guardian::factory(10)
        //     ->inactive()
        //     ->create();
    }
}
