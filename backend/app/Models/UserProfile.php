<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'bio',
        'avatar',
        'github_url',
        'linkedin_url',
        'current_xp',
        'current_level',
        'total_challenges_completed',
        'total_projects_completed',
    ];

    protected $casts = [
        'current_xp' => 'integer',
        'current_level' => 'integer',
        'total_challenges_completed' => 'integer',
        'total_projects_completed' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function addXP(int $amount): void
    {
        $this->current_xp += $amount;
        $this->checkLevelUp();
        $this->save();
    }

}
