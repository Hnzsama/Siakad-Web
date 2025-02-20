<?php

namespace Database\Factories;

use App\Models\ClassLevel;
use App\Models\Major;
use App\Models\Shift;
use App\Models\StudyGroup;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Classroom>
 */
class ClassroomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'teacher_id' => Teacher::inRandomOrder()->first()->id,
            'class_level_id' => ClassLevel::inRandomOrder()->first()->id,
            'study_group_id' => StudyGroup::inRandomOrder()->first()->id,
            'shift_id' => Shift::inRandomOrder()->first()->id,
            'major_id' => Major::inRandomOrder()->first()->id,
            'room_number' => $this->faker->boolean() ? $this->faker->buildingNumber() : null,
            'status' => $this->faker->boolean(),
        ];
    }
}
