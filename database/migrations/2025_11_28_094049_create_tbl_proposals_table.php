<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tbl_proposals', function (Blueprint $table) {
            $table->id('proposal_id');

            // Existing foreign keys
            $table->unsignedBigInteger('user_id')->nullable()->default(0);
            $table->unsignedSmallInteger('program_id')->nullable()->default(0);

            // New foreign keys with defaults
            $table->unsignedBigInteger('proponent_id')->nullable()->default(0);
            $table->unsignedBigInteger('collaborator_id')->nullable()->default(0);
            $table->unsignedBigInteger('beneficiary_id')->nullable()->default(0);

            // Project fields
            $table->string('project_type', 100)->nullable(); // For LGIA sub-type
            $table->string('title', 255);
            $table->text('details');
            $table->string('status', 50)->default('Pending');
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('user_id')->references('user_id')->on('tbl_users')->onDelete('set null');
            $table->foreign('program_id')->references('program_id')->on('tbl_programs')->onDelete('set null');

            $table->foreign('proponent_id')->references('proponent_id')->on('tbl_proponents')->onDelete('set null');
            $table->foreign('collaborator_id')->references('collaborator_id')->on('tbl_collaborators')->onDelete('set null');
            $table->foreign('beneficiary_id')->references('beneficiary_id')->on('tbl_beneficiaries')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_proposals');
    }
};
