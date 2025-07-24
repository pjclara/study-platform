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
        Schema::create('data_entries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('participant_id')->constrained('participants')->onDelete('cascade');
            $table->foreignUuid('variable_id')->constrained('variables')->onDelete('cascade');
            $table->text('value')->nullable();
            $table->foreignUuid('filled_by')->constrained('users');
            $table->timestamp('filled_at')->nullable();
            $table->softDeletes(); // For archiving data entries
            $table->foreignUuid('created_by')->constrained('users');
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
        Schema::dropIfExists('data_enteries');
    }
};
