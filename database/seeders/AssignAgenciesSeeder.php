<?php

namespace Database\Seeders;

use App\Models\Agency;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Database\Seeder;

class AssignAgenciesSeeder extends Seeder
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

        foreach ($students as $student) {
            $agency = Agency::factory()->create([
                'agencyable_id' => $student->id,
                'agencyable_type' => Student::class,
            ]);
        }

        foreach ($teachers as $teacher) {
            $agency = Agency::factory()->create([
                'agencyable_id' => $teacher->id,
                'agencyable_type' => Teacher::class,
            ]);
        }
    }
}
