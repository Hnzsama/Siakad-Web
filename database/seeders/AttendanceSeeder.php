<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $students = Student::all();
        $teachers = Teacher::all();
        // Get current week and year
        $now = Carbon::now();
        $startOfWeek = $now->startOfWeek(Carbon::MONDAY);
        $endOfWeek = $now->endOfWeek(Carbon::FRIDAY);
        $semester = Semester::where('status', 'active')->first();

        // Loop through each day in the week
        for ($date = $startOfWeek; $date->lte($endOfWeek); $date->addDay()) {
            // Skip weekends
            if ($date->dayOfWeek >= Carbon::SATURDAY) {
                continue;
            }

            foreach ($students as $student) {
                // Randomly decide if there should be attendance for this student on this day
                if (!\Faker\Factory::create()->boolean(80)) {
                    continue;
                }

                $status = \Faker\Factory::create()->randomElement(['Present', 'Late']);
                $hasCheckOut = \Faker\Factory::create()->boolean(70);

                Attendance::factory()->create([
                    'attendable_type' => Student::class,
                    'attendable_id' => $student->id,
                    'semester_id' => $semester->id,
                    'date' => $date,
                    'check_in' => \Faker\Factory::create()->time('H:i:s'),
                    'check_out' => $hasCheckOut ? \Faker\Factory::create()->time('H:i:s') : null,
                    'status' => $status,
                ]);
            }

            foreach ($teachers as $teacher) {
                // Randomly decide if there should be attendance for this teacher on this day
                if (!\Faker\Factory::create()->boolean(80)) {
                    continue;
                }

                $status = \Faker\Factory::create()->randomElement(['Present', 'Late']);
                $hasCheckOut = \Faker\Factory::create()->boolean(70);

                Attendance::factory()->create([
                    'attendable_type' => Teacher::class,
                    'attendable_id' => $teacher->id,
                    'semester_id' => $semester->id,
                    'date' => $date,
                    'check_in' => \Faker\Factory::create()->time('H:i:s'),
                    'check_out' => $hasCheckOut ? \Faker\Factory::create()->time('H:i:s') : null,
                    'status' => $status,
                ]);
            }
        }
    }
}
