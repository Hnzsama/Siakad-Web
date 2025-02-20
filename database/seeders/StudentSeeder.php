<?php
namespace Database\Seeders;
use App\Models\User;
use App\Models\Student;
use App\Models\Semester;
use App\Models\Guardian;
use App\Models\Classroom;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create('id_ID');
        // Get existing relationships
        $semesters = Semester::pluck('id');
        $guardians = Guardian::pluck('id');
        $classrooms = Classroom::all(); // Mengambil semua objek kelas

        foreach ($classrooms as $index => $classroom) {
            for ($i = 1; $i <= 5; $i++) {
                $gender = $faker->randomElement(['Male', 'Female']);
                $firstName = $faker->firstName($gender === 'Male' ? 'male' : 'female');
                $lastName = $faker->lastName;
                $name = $firstName . ' ' . $lastName;

                // Create user first with unique email
                $user = User::factory()->create([
                    'name' => $name,
                    'email' => 'student' . ($index + 1) . '_' . $i . '@gmail.com',
                    'password' => bcrypt('12345678')
                ]);
                $user->assignRole('student');

                $enrollmentDate = $faker->dateTimeBetween('-4 years', '-1 year');
                $graduationDate = $faker->optional(0.2)->dateTimeBetween($enrollmentDate, 'now');

                Student::create([
                    'id' => Str::uuid(),
                    'user_id' => $user->id, // Use the created user's ID
                    'semester_id' => $faker->randomElement($semesters),
                    'guardian_id' => $faker->randomElement($guardians),
                    'name' => $name,
                    'nik' => $faker->unique()->numerify('################'),
                    'nis' => $faker->unique()->numerify('########'),
                    'gender' => $gender,
                    'place_of_birth' => $faker->city,
                    'date_of_birth' => $faker->dateTimeBetween('-20 years', '-15 years'),
                    'address' => $faker->address,
                    'phone' => $faker->unique()->phoneNumber,
                    'email' => $faker->unique()->safeEmail,
                    'status' => $faker->randomElement(['Active', 'Graduated', 'Dropped Out']),
                    'enrollment_date' => $enrollmentDate,
                    'graduation_date' => $graduationDate,
                    'violation_points' => $faker->numberBetween(0, 100),
                    'classroom_id' => $classroom->id, // Tetapkan siswa ke kelas saat ini
                ]);
            }
        }
    }
}
