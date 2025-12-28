<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Challenge extends Model
{
    use HasFactory;

    protected $fillable = [
        'lesson_id',
        'title',
        'slug',
        'description',
        'difficulty',
        'challenge_type',
        'xp_reward',
        'time_limit_minutes',
        'test_cases',
        'starter_code',
        'solution_code',
        'hints',
        'is_published',
    ];

    protected $casts = [
        'lesson_id' => 'integer',
        'xp_reward' => 'integer',
        'time_limit_minutes' => 'integer',
        'test_cases' => 'array',
        'hints' => 'array',
        'is_published' => 'boolean',
    ];


}

