<?php

namespace Database\Factories;

use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SubjectTeacher>
 */
class SubjectTeacherFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Get a random teacher that hasn't been assigned to this subject yet
        $subject = Subject::inRandomOrder()->first();
        $teacher = Teacher::whereDoesntHave('subjects', function ($query) use ($subject) {
            $query->where('subject_id', $subject->id);
        })->inRandomOrder()->first();

        // If no available teacher is found, create a new one
        if (!$teacher) {
            $teacher = Teacher::factory()->create();
        }

        return [
            'subject_id' => $subject->id,
            'teacher_id' => $teacher->id,
        ];
    }
}
