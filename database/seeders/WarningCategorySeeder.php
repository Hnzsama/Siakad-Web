<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class WarningCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('warning_categories')->insert([
            [
                'id' => Str::uuid(),
                'category_name' => 'SP1',
                'description' => 'Surat Peringatan Pertama',
                'level' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'category_name' => 'SP2',
                'description' => 'Surat Peringatan Kedua',
                'level' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'category_name' => 'SP3',
                'description' => 'Surat Peringatan Ketiga',
                'level' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
