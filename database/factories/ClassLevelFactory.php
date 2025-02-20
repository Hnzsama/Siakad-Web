<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ClassLevel>
 */
class ClassLevelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'alphabet' => fake()->word(),
            'level' => fake()->numberBetween(1, 3),
            'created_at' => now()
        ];
    }
}
