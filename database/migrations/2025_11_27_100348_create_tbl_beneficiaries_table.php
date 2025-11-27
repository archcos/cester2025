<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_beneficiaries', function (Blueprint $table) {
            $table->id('beneficiary_id');
            $table->string('beneficiary');
            $table->string('beneficiary_leader');
            $table->enum('beneficiary_leader_sex', ['Male', 'Female', 'Other'])->nullable();
            $table->integer('male_beneficiaries')->default(0);
            $table->integer('female_beneficiaries')->default(0);
            $table->integer('total_beneficiaries')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_beneficiaries');
    }
};
