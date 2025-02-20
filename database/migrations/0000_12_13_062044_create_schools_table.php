<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('schools', function (Blueprint $table) {
            $table->uuid('id')->primary();
            // School Identity
            $table->string('name');
            $table->string('npsn')->unique();
            $table->string('schoolLevel');

            // School Address and Contact
            $table->string('address'); // alamat -> address
            $table->integer('province_code');
            $table->foreign('province_code')->references('code')->on('provinces')->cascadeOnDelete(); // province -> provinces
            $table->integer('regency_code');
            $table->foreign('regency_code')->references('code')->on('regencies')->cascadeOnDelete();
            $table->integer('district_code');
            $table->foreign('district_code')->references('code')->on('districts')->cascadeOnDelete();
            $table->string('postal_code'); // kode_pos -> postal_code
            $table->string('phone')->unique()->nullable(); // telepon -> phone
            $table->string('email')->unique()->nullable();
            $table->string('website')->unique()->nullable();

            // School Profile
            $table->string('accreditation')->nullable(); // akreditasi -> accreditation
            $table->year('accreditation_year')->nullable(); // tahun_akreditasi -> accreditation_year
            $table->string('headmaster')->nullable(); // kepala_sekolah -> headmaster
            $table->integer('teacher_count')->nullable(); // jumlah_guru -> teacher_count
            $table->integer('student_count')->nullable(); // jumlah_siswa -> student_count
            $table->string('ownership')->nullable(); // kepemilikan -> ownership
            $table->year('establishment_year')->nullable(); // tahun_berdiri -> establishment_year
            $table->string('curriculum')->nullable(); // kurikulum -> curriculum
            $table->string('logo')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schools');
    }
};
