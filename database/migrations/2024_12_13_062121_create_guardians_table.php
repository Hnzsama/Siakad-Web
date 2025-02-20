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
        Schema::create('guardians', function (Blueprint $table) {
            $table->uuid('id')->primary();
            // Guardian's Identity
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->enum('relationship', ['Father', 'Mother', 'Guardian', 'Other']);
            $table->string('nik')->unique();
            $table->string('phone')->unique();
            $table->string('email')->unique();
            $table->date('date_of_birth');
            $table->string('address');
            $table->enum('gender', ['Male', 'Female']);

            // Employment and Financial Information
            $table->string('occupation')->nullable();
            $table->decimal('income', 10, 2)->nullable();

            // Status and Relation
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
        Schema::dropIfExists('guardians');
    }
};
