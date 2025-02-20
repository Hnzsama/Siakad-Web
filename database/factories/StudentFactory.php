<?php

namespace Database\Factories;

use App\Models\Classroom;
use App\Models\Guardian;
use App\Models\Semester;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gender = fake()->randomElement(['Male', 'Female']);
        $status = fake()->randomElement(['Active', 'Graduated', 'Dropped Out']);
        $enrollmentDate = fake()->dateTimeBetween('-4 years', '-1 year');

        return [
            'user_id' => User::factory(),
            'semester_id' => Semester::inRandomOrder()->first()->id,
            'guardian_id' => Guardian::inRandomOrder()->first()->id,
            'name' => fake()->name($gender),
            'nik' => fake()->unique()->numerify('################'),
            'nis' => fake()->unique()->numerify('########'),
            'gender' => $gender,
            'place_of_birth' => fake()->city(),
            'date_of_birth' => fake()->dateTimeBetween('-20 years', '-15 years'),
            'address' => fake()->address(),
            'phone' => fake()->unique()->phoneNumber(),
            'email' => fake()->unique()->safeEmail(),
            'status' => $status,
            'enrollment_date' => $enrollmentDate,
            'graduation_date' => $status === 'Graduated' ? fake()->dateTimeBetween($enrollmentDate, 'now') : null,
            'violation_points' => fake()->numberBetween(0, 100),
            'classroom_id' => Classroom::inRandomOrder()->first()->id,
        ];
    }
}
