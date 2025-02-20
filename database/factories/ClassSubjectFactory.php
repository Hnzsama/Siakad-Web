<?php

namespace Database\Factories;

use App\Models\Classroom;
use App\Models\ClassSubject;
use App\Models\SubjectTeacher;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;

class ClassSubjectFactory extends Factory
{
    public function definition(): array
    {
        return [
            'subject_teacher_id' => SubjectTeacher::factory(),
            'classroom_id' => Classroom::factory(),
            'day' => fake()->randomElement(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
            'start_time' => fake()->time(format: 'H:i'),
            'end_time' => fake()->time(format: 'H:i'),
            'status' => fake()->boolean()
        ];
    }
}
