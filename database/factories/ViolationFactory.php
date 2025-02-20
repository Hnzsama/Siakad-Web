<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Student;
use App\Models\Semester;
use App\Models\ViolationType;
use Illuminate\Database\Eloquent\Factories\Factory;

class ViolationFactory extends Factory
{
    public function definition(): array
    {
        $user = User::inRandomOrder()->first() ?? User::factory()->create();
        $student = Student::inRandomOrder()->first() ?? Student::factory()->create();
        $semester = Semester::inRandomOrder()->first() ?? Semester::factory()->create();
        $violationType = ViolationType::inRandomOrder()->first() ?? ViolationType::factory()->create();

        return [
            'student_id' => $student->id,
            'semester_id' => $semester->id,
            'violation_type_id' => $violationType->id,
            'violation_date' => fake()->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'description' => fake()->paragraph(),
            'document_path' => fake()->boolean(30) ? fake()->filePath() : null,
            'status' => fake()->randomElement(['pending', 'cancelled', 'approved']),
            'approved_by' => null,
            'cancelled_at' => null,
            'cancellation_reason' => null,
            'cancelled_by' => null,
            'sanction_start_date' => null,
            'sanction_end_date' => null,
            'sanction_notes' => null,
            'created_by' => $user->id,
            'updated_by' => null,
        ];
    }

    // State untuk violation yang sudah diapprove
    public function approved(): static
    {
        return $this->state(function (array $attributes) {
            $approver = User::inRandomOrder()->first() ?? User::factory()->create();

            return [
                'status' => 'approved',
                'approved_by' => $approver->id,
                'sanction_start_date' => fake()->dateTimeBetween('now', '+1 month')->format('Y-m-d'),
                'sanction_end_date' => fake()->dateTimeBetween('+1 month', '+2 months')->format('Y-m-d'),
                'sanction_notes' => fake()->sentence(),
            ];
        });
    }

    // State untuk violation yang dibatalkan
    public function cancelled(): static
    {
        return $this->state(function (array $attributes) {
            $canceller = User::inRandomOrder()->first() ?? User::factory()->create();

            return [
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'cancellation_reason' => fake()->sentence(),
                'cancelled_by' => $canceller->id,
            ];
        });
    }
}
