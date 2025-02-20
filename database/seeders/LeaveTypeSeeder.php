<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LeaveTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('leave_types')->insert([
            [
                'id' => Str::uuid(),
                'leave_name' => 'Cuti Tahunan',
                'description' => 'Alokasi cuti tahunan reguler',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'leave_name' => 'Cuti Sakit',
                'description' => 'Cuti untuk alasan kesehatan',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'leave_name' => 'Cuti Pribadi',
                'description' => 'Cuti untuk urusan pribadi',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
