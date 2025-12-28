<?php

namespace App\Services;

use App\Models\User;
use App\Models\Challenge;
use App\Models\UserChallengeProgress;
use Illuminate\Support\Facades\DB;

class ChallengeService
{
    private GamificationService $gamificationService;

    public function __construct(GamificationService $gamificationService)
    {
        $this->gamificationService = $gamificationService;
    }

    public function getAllChallenges(?string $difficulty = null)
    {
        $query = Challenge::where('is_published', true)->with('lesson');

        if ($difficulty) {
            $query->where('difficulty', $difficulty);
        }

        return $query->get()->map(fn($challenge) => [
            'id' => $challenge->id,
            'title' => $challenge->title,
            'slug' => $challenge->slug,
            'description' => $challenge->description,
            'difficulty' => $challenge->difficulty,
            'challenge_type' => $challenge->challenge_type,
            'xp_reward' => $challenge->xp_reward,
            'time_limit_minutes' => $challenge->time_limit_minutes,
            'lesson' => $challenge->lesson ? [
                'id' => $challenge->lesson->id,
                'title' => $challenge->lesson->title,
                'slug' => $challenge->lesson->slug,
            ] : null,
        ]);
    }

    public function getChallengeBySlug(string $slug)
    {
        $challenge = Challenge::where('slug', $slug)
            ->where('is_published', true)
            ->with('lesson')
            ->firstOrFail();

        return [
            'id' => $challenge->id,
            'title' => $challenge->title,
            'slug' => $challenge->slug,
            'description' => $challenge->description,
            'difficulty' => $challenge->difficulty,
            'challenge_type' => $challenge->challenge_type,
            'xp_reward' => $challenge->xp_reward,
            'time_limit_minutes' => $challenge->time_limit_minutes,
            'starter_code' => $challenge->starter_code,
            'hints' => $challenge->hints,
            'lesson' => $challenge->lesson ? [
                'id' => $challenge->lesson->id,
                'title' => $challenge->lesson->title,
            ] : null,
        ];
    }


}
