<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_proponents', function (Blueprint $table) {
            $table->id('proponent_id');
            $table->string('proponent_name');
            $table->enum('sex', ['Male', 'Female', 'Other'])->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_proponents');
    }
};
