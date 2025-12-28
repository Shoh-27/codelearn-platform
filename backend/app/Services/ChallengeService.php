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

    public function submitChallenge(User $user, int $challengeId, string $code): array
    {
        DB::beginTransaction();

        try {
            $challenge = Challenge::findOrFail($challengeId);

            // Get or create progress
            $progress = UserChallengeProgress::firstOrCreate(
                ['user_id' => $user->id, 'challenge_id' => $challengeId],
                ['status' => 'in_progress', 'attempts' => 0]
            );

            $progress->increment('attempts');
            $progress->submitted_code = $code;

            // Simple validation (MVP - basic check)
            $isCorrect = $this->validateSubmission($code, $challenge);

            if ($isCorrect) {
                // Mark as completed
                $progress->markCompleted($challenge->xp_reward);

                // Update user profile stats
                $user->profile->increment('total_challenges_completed');

                // Award XP
                $gamificationResult = $this->gamificationService->awardXP(
                    $user,
                    $challenge->xp_reward,
                    'challenge',
                    $challenge->id,
                    "Completed challenge: {$challenge->title}"
                );

                DB::commit();

                return [
                    'success' => true,
                    'message' => 'Challenge completed successfully!',
                    'xp_awarded' => $challenge->xp_reward,
                    'gamification' => $gamificationResult,
                ];
            }

            $progress->status = 'failed';
            $progress->save();

            DB::commit();

            return [
                'success' => false,
                'message' => 'Solution incorrect. Try again!',
                'attempts' => $progress->attempts,
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    private function validateSubmission(string $code, Challenge $challenge): bool
    {
        // MVP: Simple validation - check if code is not empty and contains key terms
        // In production, integrate with code execution sandbox

        if (empty(trim($code))) {
            return false;
        }

        // For MVP, accept any non-empty submission
        // Real implementation would execute test cases
        return strlen($code) > 20;
    }

    public function getUserProgress(User $user, int $challengeId): ?array
    {
        $progress = UserChallengeProgress::where('user_id', $user->id)
            ->where('challenge_id', $challengeId)
            ->first();

        if (!$progress) {
            return null;
        }

        return [
            'status' => $progress->status,
            'attempts' => $progress->attempts,
            'xp_earned' => $progress->xp_earned,
            'completed_at' => $progress->completed_at?->toDateTimeString(),
        ];
    }

    public function createChallenge(array $data): Challenge
    {
        return Challenge::create($data);
    }

    public function updateChallenge(int $id, array $data): Challenge
    {
        $challenge = Challenge::findOrFail($id);
        $challenge->update($data);
        return $challenge->fresh();
    }

    public function deleteChallenge(int $id): void
    {
        Challenge::findOrFail($id)->delete();
    }
}
