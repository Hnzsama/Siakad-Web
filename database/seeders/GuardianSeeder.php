<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Guardian;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class GuardianSeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create('id_ID');

        foreach(range(1, 30) as $index) {
            $gender = $faker->randomElement(['Male', 'Female']);
            $firstName = $faker->firstName($gender === 'Male' ? 'male' : 'female');
            $lastName = $faker->lastName;
            $name = $firstName . ' ' . $lastName;

            // Create user first
            $user = User::factory()->create([
                'name' => $name,
                'email' => 'guardian' . $index . '@gmail.com',
                'password' => bcrypt('12345678')
            ]);
            $user->assignRole('guardian');

            Guardian::create([
                'id' => Str::uuid(),
                'user_id' => $user->id,
                'name' => $name,
                'relationship' => $faker->randomElement(['Father', 'Mother', 'Guardian', 'Other']),
                'nik' => $faker->unique()->numerify('################'),
                'phone' => $faker->unique()->phoneNumber(),
                'email' => $user->email,
                'date_of_birth' => $faker->dateTimeBetween('-60 years', '-30 years'),
                'address' => $faker->address,
                'gender' => $gender,
                'occupation' => $faker->jobTitle,
                'income' => $faker->numberBetween(3000000, 20000000),
                'status' => true,
            ]);
        }
    }
}
