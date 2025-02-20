<?php

namespace Database\Seeders;

use App\Models\Schedule;
use App\Models\Shift;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    $shifts = Shift::all();

    foreach ($shifts as $shift) {
        foreach (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as $day) {
            if (!Schedule::where('shift_id', $shift->id)->where('day', $day)->exists()) {
                Schedule::create([
                    'shift_id' => $shift->id,
                    'day' => $day,
                    'start_time' => '06:30',
                    'end_time' => '15:00',
                    'entry_grace_period' => '08:50',
                    'exit_grace_period' => '01:21',
                    'status' => 1
                ]);
            }
        }
    }
}
}
