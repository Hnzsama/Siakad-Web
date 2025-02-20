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
        Schema::create('import_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('import_type');
            $table->string('user_id');
            $table->boolean('success')->default(false);
            $table->string('message')->nullable();
            $table->boolean('is_done')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('import_statuses');
    }
};
