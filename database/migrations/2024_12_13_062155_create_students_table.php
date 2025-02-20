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
        Schema::create('students', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();

            // School Information
            $table->foreignUuid('semester_id')->constrained('semesters')->cascadeOnDelete();

            // Parent Information
            $table->foreignUuid('guardian_id')->nullable()->constrained('guardians')->nullOnDelete();

            // Student Identity
            $table->string('name');
            $table->string('nik')->unique();

            // $table->string('nisn')->unique();
            $table->string('nis')->unique();
            $table->enum('gender', ['Male', 'Female']);
            $table->string('place_of_birth');
            $table->date('date_of_birth');
            $table->string('address');
            $table->string('phone')->nullable()->unique();
            $table->string('email')->unique();

            // Academic Information
            $table->enum('status', ['Active', 'Graduated', 'Dropped Out']);
            $table->date('enrollment_date');
            $table->date('graduation_date')->nullable();
            $table->integer('violation_points')->default(100);
            $table->foreignUuid('classroom_id')->nullable()->constrained()->nullOnDelete();

            $table->softDeletes();
            $table->timestamps();
        });

        // Schema::create('student_histories', function (Blueprint $table) {
        //     $table->uuid('id')->primary();
        //     $table->foreignUuid('student_id')->constrained('students')->cascadeOnDelete();
        //     $table->foreignUuid('semester_id')->constrained('semesters')->cascadeOnDelete();
        //     $table->foreignUuid('classroom_id')->constrained('classrooms')->cascadeOnDelete();
        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
        Schema::dropIfExists('student_histories');
    }
};
