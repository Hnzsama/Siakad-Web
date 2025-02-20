<?php

namespace Database\Factories;

use App\Models\LeaveType;
use App\Models\Semester;
use App\Models\User;
use DateTime;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LeaveRequest>
 */
class LeaveRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Generate a start date between now and 2 months in the future
        $startDate = $this->faker->dateTimeBetween('now', '+2 months');

        // Create a copy of start date for the end date range
        $minEndDate = clone $startDate;
        $maxEndDate = (clone $startDate)->modify('+1 month');

        // Generate end date between start date and 1 month after start
        $endDate = $this->faker->dateTimeBetween(
            $minEndDate->format('Y-m-d H:i:s'),
            $maxEndDate->format('Y-m-d H:i:s')
        );

        // Get current date for rejection date range
        $now = new DateTime();

        return [
            'leavable_type' => $this->faker->randomElement(['App\Models\Student', 'App\Models\Teacher']),
            'leavable_id' => function (array $attributes) {
                $model = $attributes['leavable_type'];
                return $model::inRandomOrder()->first()->id;
            },
            'semester_id' => Semester::inRandomOrder()->first()->id,
            'leave_type_id' => LeaveType::inRandomOrder()->first()->id,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'reason' => $this->faker->paragraph(),
            'attachment_url' => $this->faker->url(),
            'status' => $this->faker->randomElement(['Pending', 'Approved', 'Rejected']),
            'approved_by' => function (array $attributes) {
                return $attributes['status'] !== 'Pending' ? User::inRandomOrder()->first()->id : null;
            },
            'rejected_at' => function (array $attributes) use ($now) {
                if ($attributes['status'] !== 'Rejected') {
                    return null;
                }

                // If start date is in the future, rejection happens between now and start date
                if ($attributes['start_date'] > $now) {
                    return $this->faker->dateTimeBetween('now', $attributes['start_date']);
                }

                // If start date is in the past, rejection happens between start date and now
                return $this->faker->dateTimeBetween($attributes['start_date'], 'now');
            },
            'rejection_reason' => function (array $attributes) {
                return $attributes['status'] === 'Rejected' ? $this->faker->sentence() : null;
            },
            'rejected_by' => function (array $attributes) {
                return $attributes['status'] === 'Rejected' ? User::inRandomOrder()->first()->id : null;
            },
        ];
    }
}
