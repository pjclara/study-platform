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
        Schema::create('variables', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('study_id')->constrained('studies')->onDelete('cascade');
            $table->string('name');
            $table->enum('type', ['text', 'number', 'date', 'boolean', 'select'])->default('text');
            $table->json('options')->nullable(); // opções para o tipo select
            $table->boolean('required')->default(false);
            $table->string('unit')->nullable(); // e.g., kg, cm, etc.
            $table->string('group')->nullable(); // e.g., demographic, clinical
            $table->integer('order_index')->default(0); // for ordering variables in forms
            $table->softDeletes(); // for archiving variables
            $table->foreignUuid('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignUuid('deleted_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('variables');
    }
};
