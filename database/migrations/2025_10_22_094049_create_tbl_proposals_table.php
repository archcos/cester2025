<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tbl_proposals', function (Blueprint $table) {
            $table->id('proposal_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedSmallInteger('program_id')->nullable();
            $table->string('project_type', 100)->nullable(); // For LGIA sub-type
            $table->string('title', 255);
            $table->text('details');
            $table->string('status', 50)->default('Pending');
            $table->timestamps();

            $table->foreign('user_id')->references('user_id')->on('tbl_users')->onDelete('set null');
            $table->foreign('program_id')->references('program_id')->on('tbl_programs')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_proposals');
    }
};
