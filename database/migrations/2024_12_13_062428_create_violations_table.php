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
        Schema::create('violations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignUuid('semester_id')->constrained('semesters')->cascadeOnDelete();
            $table->foreignUuid('violation_type_id')->constrained('violation_types')->cascadeOnDelete();
            $table->date('violation_date');
            $table->text('description');
            $table->string('document_path')->nullable();

            // Approval/Cancellation information
            $table->enum('status', ['pending', 'cancelled', 'approved'])->default('pending');
            $table->foreignUuid('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->foreignUuid('cancelled_by')->nullable()->constrained('users')->nullOnDelete();

            // Sanctions
            $table->date('sanction_start_date')->nullable();
            $table->date('sanction_end_date')->nullable();
            $table->text('sanction_notes')->nullable();

            // Audit trail
            $table->foreignUuid('created_by')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('violations');
    }
};
