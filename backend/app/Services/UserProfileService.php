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

    public function updateProfile(User $user, array $data): UserProfile
    {
        $profile = $user->profile;

        if (isset($data['name'])) {
            $user->name = $data['name'];
            $user->save();
        }

        $profileData = array_filter([
            'bio' => $data['bio'] ?? null,
            'github_url' => $data['github_url'] ?? null,
            'linkedin_url' => $data['linkedin_url'] ?? null,
        ], fn($value) => $value !== null);

        if (!empty($profileData)) {
            $profile->update($profileData);
        }

        return $profile->fresh();
    }

    public function uploadAvatar(User $user, $file): string
    {
        $profile = $user->profile;

        // Delete old avatar if exists
        if ($profile->avatar) {
            Storage::disk('public')->delete($profile->avatar);
        }

        // Store new avatar
        $path = $file->store('avatars', 'public');

        $profile->update(['avatar' => $path]);

        return Storage::url($path);
    }

    public function getStats(User $user): array
    {
        $profile = $user->profile;

        $completedChallenges = $user->challengeProgress()
            ->where('status', 'completed')
            ->count();

        $totalXPEarned = $user->xpTransactions()->sum('amount');

        $recentActivity = $user->xpTransactions()
            ->latest()
            ->take(10)
            ->get()
            ->map(fn($transaction) => [
                'amount' => $transaction->amount,
                'source_type' => $transaction->source_type,
                'description' => $transaction->description,
                'created_at' => $transaction->created_at->diffForHumans(),
            ]);

        return [
            'current_xp' => $profile->current_xp,
            'current_level' => $profile->current_level,
            'total_xp_earned' => $totalXPEarned,
            'challenges_completed' => $completedChallenges,
            'projects_completed' => $profile->total_projects_completed,
            'badges_earned' => $user->badges->count(),
            'recent_activity' => $recentActivity,
        ];
    }
}
