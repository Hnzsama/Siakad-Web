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
        Schema::create('teachers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('shift_id')->nullable()->constrained()->nullOnDelete();

            // Teacher Identity
            $table->string('name');
            $table->string('nip')->unique();
            $table->enum('gender', ['Male', 'Female']);
            $table->string('place_of_birth');
            $table->date('date_of_birth');

            // Education and Qualifications
            $table->string('highest_education')->nullable();
            $table->string('major')->nullable();
            $table->string('university')->nullable();
            $table->string('certification')->nullable();

            // Address and Contact
            $table->string('address');
            $table->string('phone')->nullable();
            $table->string('email')->unique();

            // Employment Status
            $table->string('position')->nullable();
            // $table->enum('level', ['Elementary', 'Junior High', 'Senior High', 'Vocational']); // Teaching Level
            $table->string('subject')->nullable();

            // Work Experience and Employment History
            $table->year('year_started');
            $table->year('year_ended')->nullable();
            $table->text('work_experience')->nullable();

            // Activity Status
            $table->boolean('status')->default(true);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
