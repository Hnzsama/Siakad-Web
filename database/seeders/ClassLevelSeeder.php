<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClassLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classLevels = [
            [
                'alphabet' => 'X',
                'level' => 1,
            ],
            [
                'alphabet' => 'XI',
                'level' => 2,
            ],
            [
                'alphabet' => 'XII',
                'level' => 3,
            ],
            [
                'alphabet' => 'XIII',
                'level' => 4,
            ]
        ];

        foreach ($classLevels as $classLevel) {
            \App\Models\ClassLevel::create($classLevel);
        }
    }
}
