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

}
