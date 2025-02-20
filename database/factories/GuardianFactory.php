<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Guardian>
 */
class GuardianFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gender = $this->faker->randomElement(['Male', 'Female']);
        $firstName = $gender === 'Male' ? $this->faker->firstNameMale() : $this->faker->firstNameFemale();

        return [
            'user_id' => User::factory(),
            'name' => $firstName . ' ' . $this->faker->lastName(),
            'relationship' => $this->faker->randomElement(['Father', 'Mother', 'Guardian', 'Other']),
            'nik' => $this->faker->unique()->numerify('################'), // 16 digits for NIK
            'gender' => $gender,
            'occupation' => $this->faker->randomElement(['Pegawai Negeri', 'Wiraswasta', 'Karyawan Swasta', 'Petani', 'Nelayan']),
            'income' => $this->faker->numberBetween(2000000, 10000000), // Income in IDR
            'date_of_birth' => $this->faker->dateTimeBetween('-60 years', '-25 years')->format('Y-m-d'),
            'address' => $this->faker->address(),
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
            'status' => $this->faker->boolean(90), // 90% chance of being active
            'created_at' => $this->faker->dateTimeBetween('-5 years', 'now'),
        ];
    }

    /**
     * Define a state for guardians with high income
     */
    public function highIncome()
    {
        return $this->state(function (array $attributes) {
            return [
                'income' => $this->faker->numberBetween(10000000, 20000000),
            ];
        });
    }

    /**
     * Define a state for inactive guardians
     */
    public function inactive()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => false,
            ];
        });
    }

    /**
     * Define a state for fathers only
     */
    public function father()
    {
        return $this->state(function (array $attributes) {
            return [
                'relationship' => 'Father',
                'gender' => 'Male',
            ];
        });
    }
}
