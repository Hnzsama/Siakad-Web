<?php

namespace Database\Factories;

use App\Models\Schedule;
use App\Models\Shift;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Schedule>
 */
class ScheduleFactory extends Factory
{
    protected $model = Schedule::class;
    private static $sequence = 0;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        $shifts = Shift::all();

        // Calculate the current shift and day based on sequence
        $currentShift = $shifts[floor(static::$sequence / 7)];
        $currentDay = $days[static::$sequence % 7];

        // Increment sequence for next call
        static::$sequence++;

        // Determine start_time and end_time based on the day
        $startTime = '06:30';
        $endTime = in_array($currentDay, ['Monday', 'Tuesday', 'Wednesday', 'Thursday'])
            ? '15:00'
            : ($currentDay === 'Friday' ? '11:30' : fake()->time('H:i'));

        return [
            'shift_id' => $currentShift->id,
            'day' => $currentDay,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'entry_grace_period' => fake()->time('H:i'),
            'exit_grace_period' => fake()->time('H:i'),
            'status' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public static function resetSequence(): void
    {
        static::$sequence = 0;
    }
}
