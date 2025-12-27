<?php

namespace App\Services;

use App\Models\User;
use App\Models\Badge;
use App\Models\Level;
use App\Models\XpTransaction;
use Illuminate\Support\Facades\DB;

class GamificationService
{
    public function awardXP(User $user, int $amount, string $sourceType, ?int $sourceId = null, ?string $description = null): array
    {
        DB::beginTransaction();

        try {
            $profile = $user->profile;
            $oldLevel = $profile->current_level;

            // Create XP transaction
            XpTransaction::create([
                'user_id' => $user->id,
                'amount' => $amount,
                'source_type' => $sourceType,
                'source_id' => $sourceId,
                'description' => $description ?? "Earned {$amount} XP from {$sourceType}",
            ]);

            // Update profile XP
            $profile->addXP($amount);
            $newLevel = $profile->current_level;

            // Check for level up
            $leveledUp = $newLevel > $oldLevel;

            // Check and award badges
            $newBadges = $this->checkAndAwardBadges($user);

            DB::commit();

            return [
                'xp_awarded' => $amount,
                'total_xp' => $profile->current_xp,
                'leveled_up' => $leveledUp,
                'old_level' => $oldLevel,
                'new_level' => $newLevel,
                'new_badges' => $newBadges,
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
