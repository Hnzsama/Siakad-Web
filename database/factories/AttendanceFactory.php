<?php

namespace Database\Factories;

use App\Models\Semester;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Generator as Faker;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attendance>
 */
class AttendanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        // Random between Student or Teacher
        $attendableType = $this->faker->randomElement([
            Student::class,
            Teacher::class,
        ]);

        // Get random ID based on type
        $attendableId = $attendableType::query()->inRandomOrder()->first()?->id;

        // Generate dates for the entire semester
        $semester = Semester::query()->inRandomOrder()->first();
        $startDate = Carbon::parse($semester?->start_date ?? now());
        $endDate = Carbon::parse($semester?->end_date ?? now()->addMonths(6));

        // Generate a random date within semester period (Monday to Friday only)
        do {
            $date = $this->faker->dateTimeBetween($startDate, $endDate);
        } while ($date->format('N') > 5); // N is ISO-8601 numeric representation of the day of the week (1-7)

        // Randomly decide if check_out should be present
        $hasCheckOut = $this->faker->boolean(70);

        return [
            'id' => $this->faker->uuid(),
            'attendable_type' => $attendableType,
            'attendable_id' => $attendableId,
            'semester_id' => $semester?->id,
            'date' => $date,
            'check_in' => $this->faker->time('H:i:s'),
            'check_out' => $hasCheckOut ? $this->faker->time('H:i:s') : null,
            'status' => $this->faker->randomElement(['Present', 'Late']),
            'location_latitude' => $this->faker->optional(0.8)->latitude(),
            'location_longitude' => $this->faker->optional(0.8)->longitude(),
            'device_info' => $this->faker->optional(0.9)->userAgent(),
            'photo_path' => $this->faker->optional(0.6)->imageUrl(640, 480, 'attendance', true, 'Attendance Photo'),
            'notes' => $this->faker->optional(0.4)->sentence(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * Create multiple attendance records for a date range
     */
    public function forDateRange(Carbon $startDate, Carbon $endDate): static
    {
        return $this->state(function (array $attributes) use ($startDate, $endDate) {
            do {
                $date = $this->faker->dateTimeBetween($startDate, $endDate);
            } while ($date->format('N') > 5);

            return [
                'date' => $date,
            ];
        });
    }

    /**
     * State for student attendance
     */
    public function student(): static
    {
        return $this->state(fn(array $attributes) => [
            'attendable_type' => Student::class,
            'attendable_id' => Student::query()->inRandomOrder()->first()?->id,
        ]);
    }

    /**
     * State for teacher attendance
     */
    public function teacher(): static
    {
        return $this->state(fn(array $attributes) => [
            'attendable_type' => Teacher::class,
            'attendable_id' => Teacher::query()->inRandomOrder()->first()?->id,
        ]);
    }
}
