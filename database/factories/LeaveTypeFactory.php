<?php

namespace Database\Factories;

use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LeaveType>
 */
class LeaveTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'leave_name' => $this->faker->randomElement(['Sick Leave', 'Family Emergency', 'Personal Leave', 'Study Leave']),
            'description' => $this->faker->optional()->sentence(),
            'status' => $this->faker->boolean(80), // 80% chance of being true
        ];
    }
}
