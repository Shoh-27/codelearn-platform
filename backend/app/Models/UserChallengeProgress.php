<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class UserChallengeProgress extends Model
{
    use HasFactory;

    protected $table = 'user_challenge_progress';

    protected $fillable = [
        'user_id',
        'challenge_id',
        'status',
        'submitted_code',
        'attempts',
        'xp_earned',
        'completed_at',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'challenge_id' => 'integer',
        'attempts' => 'integer',
        'xp_earned' => 'integer',
        'completed_at' => 'datetime',
    ];


}
