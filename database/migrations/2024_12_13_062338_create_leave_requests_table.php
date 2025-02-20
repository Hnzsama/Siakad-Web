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
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuidMorphs('leavable');
            $table->foreignUuid('semester_id')->constrained('semesters')->cascadeOnDelete();
            $table->foreignUuid('leave_type_id')->constrained('leave_types')->cascadeOnDelete();
            $table->date('start_date');
            $table->date('end_date');
            $table->text('reason');
            $table->string('attachment_url');
            $table->enum('status', ['Pending', 'Approved', 'Rejected']);
            $table->foreignUuid('approved_by')->nullable()->constrained('users')->nullOnDelete();

            $table->date('rejected_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->foreignUuid('rejected_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
    }
};
