<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('challenges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->nullable()->constrained()->onDelete('set null');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->enum('difficulty', ['beginner', 'intermediate', 'advanced'])->default('beginner');
            $table->enum('challenge_type', ['multiple_choice', 'coding', 'project'])->default('coding');
            $table->integer('xp_reward')->default(100);
            $table->integer('time_limit_minutes')->nullable();
            $table->json('test_cases')->nullable();
            $table->text('starter_code')->nullable();
            $table->text('solution_code')->nullable();
            $table->json('hints')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('challenges');
    }
};
