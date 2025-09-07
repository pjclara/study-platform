<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('variable_options', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('variable_id')->constrained('variables')->onDelete('cascade');
            $table->string('value');
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });
        // Remover o campo options da tabela variables
        Schema::table('variables', function (Blueprint $table) {
            $table->dropColumn('options');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('variable_options');
        // Adicionar o campo options de volta
        Schema::table('variables', function (Blueprint $table) {
            $table->json('options')->nullable();
        });
    }
};
