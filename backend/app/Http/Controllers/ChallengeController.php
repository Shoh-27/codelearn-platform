<?php

namespace App\Http\Controllers;

use App\Services\LessonService;
use App\Services\ChallengeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChallengeController extends Controller
{
    private ChallengeService $challengeService;

    public function __construct(ChallengeService $challengeService)
    {
        $this->challengeService = $challengeService;
    }

    public function index(Request $request)
    {
        try {
            $difficulty = $request->query('difficulty');
            $challenges = $this->challengeService->getAllChallenges($difficulty);
            return response()->json(['data' => $challenges], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch challenges'], 500);
        }
    }

    public function show(string $slug)
    {
        try {
            $challenge = $this->challengeService->getChallengeBySlug($slug);
            return response()->json(['data' => $challenge], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Challenge not found'], 404);
        }
    }

    public function submit(Request $request, int $id)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        try {
            $result = $this->challengeService->submitChallenge(auth()->user(), $id, $request->input('code'));
            return response()->json($result, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Submission failed', 'error' => $e->getMessage()], 500);
        }
    }


}
