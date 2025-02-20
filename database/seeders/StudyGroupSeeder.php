<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StudyGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $studyGroups = [
            [
                'name' => 'A',
            ],
            [
                'name' => 'B',
            ],
            [
                'name' => 'C',
            ],
        ];

        foreach ($studyGroups as $studyGroup) {
            \App\Models\StudyGroup::create($studyGroup);
        }
    }
}
