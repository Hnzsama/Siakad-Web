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
        Schema::create('warning_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('category_name'); // SP1, SP2, SP3
            $table->text('description')->nullable(); // Penjelasan detail
            $table->integer('level'); // Urutan tingkat peringatan (1 untuk SP1, 2 untuk SP2, dst.)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('warning_categories');
    }
};
