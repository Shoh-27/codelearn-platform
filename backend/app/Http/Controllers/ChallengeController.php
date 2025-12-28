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

    public function progress(int $id)
    {
        try {
            $progress = $this->challengeService->getUserProgress(auth()->user(), $id);
            return response()->json(['data' => $progress], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch progress'], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'lesson_id' => 'nullable|exists:lessons,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'difficulty' => 'required|in:beginner,intermediate,advanced',
            'challenge_type' => 'required|in:multiple_choice,coding,project',
            'xp_reward' => 'required|integer|min:0',
            'starter_code' => 'nullable|string',
            'solution_code' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        try {
            $challenge = $this->challengeService->createChallenge($request->all());
            return response()->json(['message' => 'Challenge created', 'data' => $challenge], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create challenge'], 500);
        }
    }

    public function update(Request $request, int $id)
    {
        try {
            $challenge = $this->challengeService->updateChallenge($id, $request->all());
            return response()->json(['message' => 'Challenge updated', 'data' => $challenge], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update challenge'], 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->challengeService->deleteChallenge($id);
            return response()->json(['message' => 'Challenge deleted'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete challenge'], 500);
        }
    }
}
