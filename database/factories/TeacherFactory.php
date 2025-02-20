<?php

namespace Database\Factories;

use App\Models\Shift;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Teacher>
 */
class TeacherFactory extends Factory
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
            'shift_id' => Shift::inRandomOrder()->first()->id,
            'name' => $firstName . ' ' . $this->faker->lastName(),
            'nip' => $this->faker->unique()->numerify('##################'), // 18 digits
            'gender' => $gender,
            'place_of_birth' => $this->faker->city(),
            'date_of_birth' => $this->faker->dateTimeBetween('-60 years', '-25 years')->format('Y-m-d'),
            'highest_education' => $this->faker->randomElement(['S1', 'S2', 'S3']),
            'major' => $this->faker->randomElement(['Pendidikan Matematika', 'Pendidikan Bahasa Indonesia', 'Pendidikan Bahasa Inggris', 'Pendidikan Biologi', 'Pendidikan Fisika', 'Pendidikan Kimia']),
            'university' => $this->faker->randomElement(['Universitas Indonesia', 'Universitas Gadjah Mada', 'Institut Teknologi Bandung', 'Universitas Padjadjaran', 'Universitas Brawijaya']),
            'certification' => $this->faker->boolean(70) ? 'Tersertifikasi' : null,
            'address' => $this->faker->address(),
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
            'position' => $this->faker->randomElement(['Guru', 'Kepala Sekolah', 'Wakil Kepala Sekolah', 'Koordinator Mapel']),
            'subject' => $this->faker->randomElement(['Matematika', 'Bahasa Indonesia', 'Bahasa Inggris', 'Biologi', 'Fisika', 'Kimia']),
            'year_started' => $this->faker->numberBetween(1990, 2023),
            'year_ended' => $this->faker->optional(0.1)->numberBetween(2020, 2024), // 10% chance of having end date
            'work_experience' => $this->faker->optional()->paragraphs(2, true),
            'status' => $this->faker->boolean(90), // 90% chance of being active
        ];
    }

    /**
     * Define a state for certified teachers
     */
    public function certified()
    {
        return $this->state(function (array $attributes) {
            return [
                'certification' => 'Tersertifikasi',
            ];
        });
    }

    /**
     * Define a state for inactive teachers
     */
    public function inactive()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => false,
                'year_ended' => $this->faker->numberBetween(2020, 2024),
            ];
        });
    }

    /**
     * Define a state for senior teachers
     */
    public function senior()
    {
        return $this->state(function (array $attributes) {
            return [
                'year_started' => $this->faker->numberBetween(1990, 2000),
                'certification' => 'Tersertifikasi',
                'position' => $this->faker->randomElement(['Kepala Sekolah', 'Wakil Kepala Sekolah', 'Koordinator Mapel']),
            ];
        });
    }
}
