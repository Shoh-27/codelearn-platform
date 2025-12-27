<?php

namespace App\Http\Controllers;

use App\Services\GamificationService;
use Illuminate\Http\Request;

class GamificationController extends Controller
{
    private GamificationService $gamificationService;

    public function __construct(GamificationService $gamificationService)
    {
        $this->gamificationService = $gamificationService;
    }

    public function leaderboard(Request $request)
    {
        try {
            $limit = $request->query('limit', 50);
            $leaderboard = $this->gamificationService->getLeaderboard($limit);

            return response()->json([
                'data' => $leaderboard
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch leaderboard',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
