<?php

namespace Database\Factories;

use App\Models\Guardian;
use App\Models\Semester;
use App\Models\Student;
use App\Models\User;
use App\Models\WarningCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WarningLetter>
 */
class WarningLetterFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'letter_number' => 'WL-' . $this->faker->unique()->numberBetween(1000, 9999),
            'student_id' => Student::inRandomOrder()->first()->id,
            'semester_id' => Semester::inRandomOrder()->first()->id,
            'warning_category_id' => WarningCategory::inRandomOrder()->first()->id,
            'issued_date' => $this->faker->date(),
            'description' => $this->faker->paragraph(),
            'document_path' => $this->faker->optional()->filePath(),
            'parent_id' => Guardian::inRandomOrder()->first()->id,
            'parent_received_at' => $this->faker->optional()->dateTime(),
            'parent_signature_path' => $this->faker->optional()->filePath(),
            'follow_up_date' => $this->faker->optional()->date(),
            'follow_up_notes' => $this->faker->optional()->paragraph(),
            'cancelled_at' => $this->faker->optional()->dateTime(),
            'cancellation_reason' => $this->faker->optional()->paragraph(),
            'cancelled_by' => User::inRandomOrder()->first()->id,
            'cancellation_document_path' => $this->faker->optional()->filePath(),
            'approved_by' => User::inRandomOrder()->first()->id,
            'created_by' => User::inRandomOrder()->first()->id,
            'updated_by' => $this->faker->optional()->randomElement([User::inRandomOrder()->first()->id]),
            'status' => $this->faker->randomElement(['pending', 'cancelled', 'approved']),
        ];
    }
}
