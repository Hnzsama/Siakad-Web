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
        Schema::create('warning_letters', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('letter_number')->unique();
            $table->foreignUuid('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignUuid('semester_id')->constrained('semesters')->cascadeOnDelete();
            $table->foreignUuid('warning_category_id')->constrained()->cascadeOnDelete();
            $table->date('issued_date');
            $table->text('description');
            $table->string('document_path')->nullable();

            // Parent/Guardian information
            $table->foreignUuid('parent_id')->constrained('guardians')->cascadeOnDelete();
            $table->timestamp('parent_received_at')->nullable();
            $table->string('parent_signature_path')->nullable();

            // Follow up information
            $table->date('follow_up_date')->nullable();
            $table->text('follow_up_notes')->nullable();

            // Cancellation information
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->foreignUuid('cancelled_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('cancellation_document_path')->nullable();
            $table->foreignUuid('approved_by')->nullable()->constrained('users')->nullOnDelete();

            // Audit trail
            $table->foreignUuid('created_by')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();

            $table->enum('status', ['pending', 'cancelled', 'approved'])->default('pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('warning_letters');
    }
};
