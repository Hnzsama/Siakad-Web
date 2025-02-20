<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MajorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $majors = [
            [
                'name' => 'Teknik Komputer dan Jaringan',
                'status' => 1
            ],
            [
                'name' => 'Rekayasa Perangkat Lunak',
                'status' => 1
            ],
            [
                'name' => 'Multimedia',
                'status' => 1
            ],
            [
                'name' => 'Akuntansi',
                'status' => 1
            ],
            [
                'name' => 'Administrasi Perkantoran',
                'status' => 1
            ],
            [
                'name' => 'Pemasaran',
                'status' => 1
            ],
            [
                'name' => 'Teknik Kendaraan Ringan',
                'status' => 1
            ],
            [
                'name' => 'Teknik Sepeda Motor',
                'status' => 1
            ]
        ];

        foreach ($majors as $major) {
            \App\Models\Major::create($major);
        }
    }
}
