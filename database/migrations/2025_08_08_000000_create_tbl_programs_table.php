<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_programs', function (Blueprint $table) {
            // Use small integer since only 3 entries
            $table->smallIncrements('program_id'); // UNSIGNED SMALLINT AUTO_INCREMENT
            $table->string('program_name', 50)->unique();
            $table->timestamps();
        });

        DB::table('tbl_programs')->insert([
            ['program_name' => 'CEST'],
            ['program_name' => 'LGIA'],
            ['program_name' => 'SSCP'],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_programs');
    }
};
