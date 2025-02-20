<?php

namespace Database\Seeders;

use App\Models\ViolationType;
use Illuminate\Database\Seeder;

class ViolationTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $violationTypes = [
            [
                'name' => 'Terlambat',
                'points' => 10,
                'description' => 'Terlambat masuk sekolah atau kelas'
            ],
            [
                'name' => 'Berkelahi',
                'points' => 50,
                'description' => 'Terlibat dalam perkelahian fisik dengan siswa lain'
            ],
            [
                'name' => 'Mencontek',
                'points' => 30,
                'description' => 'Melakukan kecurangan saat ujian atau mengerjakan tugas'
            ],
            [
                'name' => 'Pelanggaran Seragam',
                'points' => 10,
                'description' => 'Tidak memakai seragam sesuai ketentuan'
            ],
            [
                'name' => 'Membolos',
                'points' => 25,
                'description' => 'Tidak mengikuti pelajaran tanpa izin'
            ],
            [
                'name' => 'Merokok',
                'points' => 75,
                'description' => 'Merokok di lingkungan sekolah'
            ],
            [
                'name' => 'Membawa HP',
                'points' => 15,
                'description' => 'Membawa dan menggunakan HP saat pembelajaran'
            ],
            [
                'name' => 'Merusak Fasilitas Sekolah',
                'points' => 50,
                'description' => 'Merusak fasilitas sekolah'
            ],
            [
                'name' => 'Bullying',
                'points' => 60,
                'description' => 'Melakukan tindakan bullying terhadap siswa lain'
            ],
            [
                'name' => 'Tidak Mengerjakan PR',
                'points' => 5,
                'description' => 'Tidak mengerjakan pekerjaan rumah'
            ],
            [
                'name' => 'Tidur di Kelas',
                'points' => 5,
                'description' => 'Tidur saat pelajaran berlangsung'
            ],
            [
                'name' => 'Membawa Senjata Tajam',
                'points' => 100,
                'description' => 'Membawa senjata tajam ke sekolah'
            ],
            [
                'name' => 'Mencuri',
                'points' => 80,
                'description' => 'Melakukan pencurian di lingkungan sekolah'
            ],
            [
                'name' => 'Tidak Ikut Upacara',
                'points' => 10,
                'description' => 'Tidak mengikuti upacara bendera'
            ],
            [
                'name' => 'Membuat Keributan di Kelas',
                'points' => 20,
                'description' => 'Membuat keributan saat pelajaran berlangsung'
            ]
        ];

        foreach ($violationTypes as $violationType) {
            ViolationType::create($violationType);
        }
    }
}
