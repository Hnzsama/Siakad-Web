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
        // Schema::create('announcements', function (Blueprint $table) {
        //     $table->uuid('id')->primary();
        //     $table->string('title');
        //     $table->text('content');
        //     $table->string('announcement_type')->nullable();
        //     $table->timestamp('start_date')->nullable();
        //     $table->timestamp('end_date')->nullable();
        //     $table->boolean('is_published')->default(false);
        //     $table->uuid('created_by')->nullable();
        //     $table->string('target_audience')->nullable();
        //     $table->json('attachments')->nullable();
        //     $table->timestamps();

        //     // Foreign key untuk created_by jika ada relasi ke tabel users
        //     $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
