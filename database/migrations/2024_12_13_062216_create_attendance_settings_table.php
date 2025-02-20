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
        Schema::create('attendance_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->boolean('allow_location_based')->default(false);
            $table->decimal('allowed_radius', 10, 2)->default(100); // in meters
            $table->timestamps();
        });

        Schema::create('schedules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('shift_id')->constrained()->cascadeOnDelete();
            $table->enum('day', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
            $table->time('start_time');
            $table->time('end_time');
            $table->time('entry_grace_period')->nullable();
            $table->time('exit_grace_period')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();

            $table->unique(['shift_id', 'day']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance_settings');
        Schema::dropIfExists('schedules');
    }
};
