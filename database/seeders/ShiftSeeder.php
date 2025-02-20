<?php

namespace Database\Seeders;

use App\Models\Shift;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ShiftSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $shifts = [
            [
                'name' => 'Pagi',
                'class_duration' => 30,
                'status' => 1
            ],
            [
                'name' => 'Siang',
                'class_duration' => 30,
                'status' => 1
            ],
            [
                'name' => 'Malam',
                'class_duration' => 30,
                'status' => 1
            ]
        ];

        foreach ($shifts as $shift) {
            Shift::create($shift);
        }
    }
}
