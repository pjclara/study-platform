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
        Schema::create('study_user', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('study_id')->constrained('studies')->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->string('role'); // exemplo: coordinator, viewer, editor
            // active
            $table->boolean('active')->default(true); // Indica se o usuário está ativo no estudo
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('study_user');
    }
};
