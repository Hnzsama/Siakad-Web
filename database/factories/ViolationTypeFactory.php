<?php

namespace Database\Factories;

use App\Models\School;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ViolationType>
 */
class ViolationTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement([
                'Terlambat',
                'Berkelahi',
                'Mencontek',
                'Pelanggaran Seragam',
                'Membolos',
                'Merokok',
                'Membawa HP',
                'Merusak Fasilitas Sekolah',
                'Bullying',
                'Tidak Mengerjakan PR',
                'Tidur di Kelas',
                'Membawa Senjata Tajam',
                'Mencuri',
                'Tidak Ikut Upacara',
                'Membuat Keributan di Kelas'
            ]),
            'points' => $this->faker->numberBetween(1, 100),
            'description' => $this->faker->optional()->sentence(),
        ];
    }
}
