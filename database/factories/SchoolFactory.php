<?php

namespace Database\Factories;

use App\Models\Province;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\School>
 */
class SchoolFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => $this->faker->uuid(),
            'name' => $this->faker->company(), // School name
            'npsn' => $this->faker->unique()->numerify('########'), // Unique 8-digit NPSN
            'schoolLevel' => $this->faker->randomElement(['sd', 'smp', 'sma', 'smk']), // School level

            // Address and contact
            'address' => $this->faker->address(),
            'province_code' => 35, // Assuming 34 provinces
            'regency_code' => 3578,
            'district_code' => 357801,
            'postal_code' => $this->faker->postcode(),
            'phone' => $this->faker->unique()->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
            'website' => $this->faker->unique()->url(),

            // Profile
            'accreditation' => $this->faker->randomElement(['A', 'B', 'C', 'D', null]),
            'accreditation_year' => $this->faker->optional()->year(),
            'headmaster' => $this->faker->name(),
            'teacher_count' => $this->faker->optional()->numberBetween(10, 200),
            'student_count' => $this->faker->optional()->numberBetween(50, 2000),
            'ownership' => $this->faker->randomElement(['Public', 'Private', null]),
            'establishment_year' => $this->faker->optional()->year(),
            'curriculum' => $this->faker->randomElement(['K-13', 'K-2013 Revised', 'Independent Curriculum', null]),
            'logo' => $this->faker->optional()->imageUrl(200, 200, 'education', true, 'school-logo'),
            'status' => true | false, // 80% chance of being true
            'created_at' => now(),
        ];
    }
}
