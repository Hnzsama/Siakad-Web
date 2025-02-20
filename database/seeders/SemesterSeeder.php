<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SemesterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $semesters = [
            [
                'name' => 'Semester Ganjil',
                'type' => 'odd',
                'academic_year' => '2023/2024',
                'start_date' => '2023-07-01',
                'end_date' => '2023-12-31',
                'description' => 'Semester Ganjil 2023/2024',
                'status' => 'active',
            ],
            [
                'name' => 'Semester Genap',
                'type' => 'even',
                'academic_year' => '2023/2024',
                'start_date' => '2024-01-01',
                'end_date' => '2024-06-30',
                'description' => 'Semester Genap 2023/2024',
                'status' => 'completed',
            ]
        ];

        foreach ($semesters as $semester) {
            \App\Models\Semester::create($semester);
        }
    }
}
