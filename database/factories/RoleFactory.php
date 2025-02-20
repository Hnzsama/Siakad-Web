<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Spatie\Permission\Models\Role;

class RoleFactory extends Factory
{
    protected $model = Role::class;

    public function definition()
    {
        return [
            'name' => $this->faker->unique()->word,  // Nama role yang unik
            'guard_name' => rand('web', 'api'),  // Guard yang digunakan (misalnya 'web' untuk default)
        ];
    }
}
