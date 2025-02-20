<?php

namespace Database\Factories;

use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Semester>
 */
class SemesterFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('-1 years', 'now');
        $endDate = Carbon::parse($startDate)->addMonths(6);

        return [
            'id' => Str::uuid()->toString(),
            'name' => $this->faker->unique()->words(2, true), // Example: "Semester Ganjil"
            'type' => $this->faker->randomElement(['odd', 'even']),
            'academic_year' => $this->faker->year . '/' . ($this->faker->year + 1),
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
            'description' => $this->faker->optional()->sentence(),
            'status' => $this->faker->randomElement(['active', 'completed', 'pending']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
