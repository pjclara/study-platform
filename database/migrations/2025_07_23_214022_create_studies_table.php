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
        Schema::create('studies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('study_type');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('ethical_approval')->nullable();
            $table->enum('status', ['active', 'inactive', 'archived'])->default('active');
            $table->foreignUuid('created_by')->constrained('users');
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignUuid('deleted_by')->nullable()->constrained('users')->onDelete('set null');
            $table->softDeletes(); // for archiving studies            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('studies');
    }
};
