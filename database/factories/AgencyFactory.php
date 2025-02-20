<?php
namespace Database\Factories;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Generator as Faker;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Agency>
 */
class AgencyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $agencyableClasses = [Student::class, Teacher::class];
        $agencyableType = $this->faker->randomElement($agencyableClasses);
        $agencyable = $agencyableType::inRandomOrder()->first();

        return [
            'name' => $this->faker->name(),
            'address' => $this->faker->address(),
            'longitude' => $this->faker->longitude(),
            'latitude' => $this->faker->latitude(),
            'agencyable_id' => $agencyable ? $agencyable->id : null,
            'agencyable_type' => $agencyableType,
            'status' => $this->faker->boolean(),
        ];
    }
}
