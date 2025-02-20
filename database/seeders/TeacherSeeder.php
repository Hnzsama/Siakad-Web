<?php

namespace Database\Seeders;

use App\Models\Shift;
use App\Models\User;
use App\Models\Teacher;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class TeacherSeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create('id_ID');

        // Create default teacher account
        $defaultUser = User::firstOrCreate(
            ['email' => 'teacher@gmail.com'],
            [
                'name' => 'Teacher',
                'password' => bcrypt('12345678')
            ]
        );
        if (!$defaultUser->hasRole('teacher')) {
            $defaultUser->assignRole('teacher');
        }

        // Create default teacher if not exists
        $defaultTeacher = Teacher::firstOrCreate(
            ['user_id' => $defaultUser->id],
            [
                'id' => Str::uuid(),
                'shift_id' => Shift::inRandomOrder()->first()->id,
                'name' => 'Teacher',
                'nip' => '123456789012345',
                'gender' => 'Male',
                'place_of_birth' => 'Surabaya',
                'date_of_birth' => '1990-01-01',
                'highest_education' => 'S1',
                'major' => 'Matematika',
                'university' => 'Universitas Indonesia',
                'certification' => 'Sertifikasi Guru',
                'address' => 'Jl. Pendidikan No. 1',
                'phone' => '081234567890',
                'email' => 'teacher@gmail.com',
                'position' => 'Guru Tetap',
                'subject' => 'Matematika',
                'year_started' => 2020,
                'work_experience' => 'Pengalaman mengajar matematika selama 3 tahun',
                'status' => true,
            ]
        );

        // Daftar universitas di Indonesia
        $universities = [
            'Universitas Indonesia',
            'Institut Teknologi Bandung',
            'Universitas Gadjah Mada',
            'Universitas Airlangga',
            'Universitas Brawijaya',
            'Universitas Diponegoro',
            'Universitas Padjadjaran',
            'Institut Teknologi Sepuluh Nopember',
            'Universitas Negeri Yogyakarta',
            'Universitas Negeri Jakarta'
        ];

        // Create additional teachers
        foreach (range(1, 20) as $index) {
            $gender = $faker->randomElement(['Male', 'Female']);
            $firstName = $faker->firstName($gender === 'Male' ? 'male' : 'female');
            $lastName = $faker->lastName;
            $name = $firstName . ' ' . $lastName;

            $user = User::factory()->create([
                'name' => $name,
                'email' => 'teacher' . $index . '@gmail.com',
                'password' => bcrypt('12345678')
            ]);
            $user->assignRole('teacher');

            Teacher::create([
                'id' => Str::uuid(),
                'user_id' => $user->id,
                'shift_id' => Shift::inRandomOrder()->first()->id,
                'name' => $name,
                'nip' => $faker->unique()->numerify('###############'),
                'gender' => $gender,
                'place_of_birth' => $faker->city,
                'date_of_birth' => $faker->dateTimeBetween('-50 years', '-25 years'),
                'highest_education' => $faker->randomElement(['S1', 'S2', 'S3']),
                'major' => $faker->randomElement(['Matematika', 'Fisika', 'Biologi', 'Kimia', 'Bahasa Indonesia', 'Bahasa Inggris']),
                'university' => $faker->randomElement($universities),
                'certification' => $faker->randomElement(['Sertifikasi Guru', 'Belum Sertifikasi']),
                'address' => $faker->address,
                'phone' => $faker->phoneNumber,
                'email' => 'teacher' . $index . '@gmail.com',
                'position' => $faker->randomElement(['Guru Tetap', 'Guru Honorer']),
                'subject' => $faker->randomElement(['Matematika', 'Fisika', 'Biologi', 'Kimia', 'Bahasa Indonesia', 'Bahasa Inggris']),
                'year_started' => $faker->numberBetween(2010, 2023),
                'work_experience' => $faker->text(200),
                'status' => true,
            ]);
        }
    }
}
