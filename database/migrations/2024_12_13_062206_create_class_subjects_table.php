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
        Schema::create('class_subjects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('subject_teacher_id')->nullable()->constrained('subject_teacher')->cascadeOnDelete();
            $table->foreignUuid('classroom_id')->nullable()->constrained('classrooms')->nullOnDelete();

            // Add unique constraint
            // $table->unique(['subject_teacher_id', 'classroom_id']);

            $table->enum('type', ['subject', 'break'])->default('subject');
            $table->string('name')->nullable(); // Add name field for break periods

            // Schedule columns
            $table->enum('day', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']); // Day of the week
            $table->time('start_time'); // Start time
            $table->time('end_time'); // End time
            $table->boolean('status')->default(true); // Optional: to mark if the schedule is currently active

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('class_subjects');
    }
};
