<?php

namespace Database\Seeders;

use App\Models\Classroom;
use App\Models\SubjectTeacher;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClassSubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classSubjects = [
            [
                'subject_teacher_id' => SubjectTeacher::first()->id,
                'classroom_id' => Classroom::first()->id,
                'day' => 'Monday',
                'start_time' => '06:30',
                'end_time' => '07:00',
                'status' => true
            ]
        ];

        foreach ($classSubjects as $classSubject) {
            \App\Models\ClassSubject::create($classSubject);
        }
    }
}
