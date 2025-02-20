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
        Schema::create('classrooms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('teacher_id')->nullable()->unique()->constrained('teachers')->nullOnDelete();
            $table->foreignUuid('class_level_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('study_group_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('shift_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignUuid('major_id')->nullable()->constrained()->nullOnDelete();
            $table->string('room_number')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classrooms');
    }
};
