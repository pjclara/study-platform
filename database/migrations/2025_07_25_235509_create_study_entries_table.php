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
        Schema::create('study_entries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('study_id')->constrained('studies')->onDelete('cascade');
            $table->string('identifier')->unique();
            $table->softDeletes(); // for archiving studies            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('study_entries');
    }
};
