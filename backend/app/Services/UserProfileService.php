<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Support\Facades\Storage;

class UserProfileService
{
    public function getProfile(User $user): array
    {
        $profile = $user->profile;

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'profile' => [
                'bio' => $profile->bio,
                'avatar' => $profile->avatar,
                'github_url' => $profile->github_url,
                'linkedin_url' => $profile->linkedin_url,
            ],
            'gamification' => [
                'current_xp' => $profile->current_xp,
                'current_level' => $profile->current_level,
                'level_progress' => $profile->getProgressToNextLevel(),
                'total_challenges_completed' => $profile->total_challenges_completed,
                'total_projects_completed' => $profile->total_projects_completed,
            ],
            'badges' => $user->badges->map(fn($badge) => [
                'id' => $badge->id,
                'name' => $badge->name,
                'description' => $badge->description,
                'icon' => $badge->icon,
                'earned_at' => $badge->pivot->earned_at,
            ]),
        ];
    }
}
