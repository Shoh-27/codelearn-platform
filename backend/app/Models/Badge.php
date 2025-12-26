<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'icon',
        'requirement_type',
        'requirement_value',
    ];

    protected $casts = [
        'requirement_value' => 'integer',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_badges')
            ->withTimestamps()
            ->withPivot('earned_at');
    }

    public function checkRequirement(User $user): bool
    {
        $profile = $user->profile;

        return match ($this->requirement_type) {
            'xp' => $profile->current_xp >= $this->requirement_value,
            'challenges' => $profile->total_challenges_completed >= $this->requirement_value,
            'projects' => $profile->total_projects_completed >= $this->requirement_value,
            'streak' => false, // Implement streak logic if needed
            default => false,
        };
    }
}
