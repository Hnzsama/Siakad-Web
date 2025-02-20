<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subjects = [
            ['name' => 'Bahasa Indonesia', 'type' => 'theorical', 'code' => 'BIN', 'description' => 'Mata pelajaran bahasa Indonesia'],
            ['name' => 'Matematika', 'type' => 'theorical', 'code' => 'MTK', 'description' => 'Mata pelajaran matematika'],
            ['name' => 'Fisika', 'type' => 'practical', 'code' => 'FIS', 'description' => 'Mata pelajaran fisika'],
            ['name' => 'Biologi', 'type' => 'practical', 'code' => 'BIO', 'description' => 'Mata pelajaran biologi'],
            ['name' => 'Kimia', 'type' => 'practical', 'code' => 'KIM', 'description' => 'Mata pelajaran kimia'],
            ['name' => 'Sejarah', 'type' => 'theorical', 'code' => 'SEJ', 'description' => 'Mata pelajaran sejarah'],
            ['name' => 'Geografi', 'type' => 'theorical', 'code' => 'GEO', 'description' => 'Mata pelajaran geografi'],
            ['name' => 'Ekonomi', 'type' => 'theorical', 'code' => 'EKO', 'description' => 'Mata pelajaran ekonomi'],
            ['name' => 'Sosiologi', 'type' => 'theorical', 'code' => 'SOS', 'description' => 'Mata pelajaran sosiologi'],
            ['name' => 'Bahasa Inggris', 'type' => 'theorical', 'code' => 'ENG', 'description' => 'Mata pelajaran bahasa Inggris'],
            ['name' => 'Pendidikan Jasmani', 'type' => 'practical', 'code' => 'PJK', 'description' => 'Mata pelajaran pendidikan jasmani'],
            ['name' => 'Seni Budaya', 'type' => 'practical', 'code' => 'SBD', 'description' => 'Mata pelajaran seni budaya'],
            ['name' => 'Prakarya', 'type' => 'practical', 'code' => 'PKR', 'description' => 'Mata pelajaran prakarya'],
            ['name' => 'Pendidikan Agama', 'type' => 'theorical', 'code' => 'PAI', 'description' => 'Mata pelajaran pendidikan agama'],
            ['name' => 'PKN', 'type' => 'theorical', 'code' => 'PKN', 'description' => 'Mata pelajaran pendidikan kewarganegaraan'],
            ['name' => 'TIK', 'type' => 'practical', 'code' => 'TIK', 'description' => 'Mata pelajaran teknologi informasi'],
            ['name' => 'Bahasa Jawa', 'type' => 'theorical', 'code' => 'BJW', 'description' => 'Mata pelajaran bahasa Jawa'],
            ['name' => 'Bahasa Arab', 'type' => 'theorical', 'code' => 'ARB', 'description' => 'Mata pelajaran bahasa Arab'],
            ['name' => 'Kesenian', 'type' => 'practical', 'code' => 'KES', 'description' => 'Mata pelajaran kesenian'],
            ['name' => 'Bimbingan Konseling', 'type' => 'theorical', 'code' => 'BK', 'description' => 'Mata pelajaran bimbingan konseling']
        ];

        foreach ($subjects as $subject) {
            \App\Models\Subject::create([
                'id' => \Illuminate\Support\Str::uuid(),
                'name' => $subject['name'],
                'type' => $subject['type'],
                'code' => $subject['code'],
                'description' => $subject['description'],
                'status' => true
            ]);
        }
    }
}
