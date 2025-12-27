<?php

namespace App\Http\Controllers;

use App\Services\LessonService;
use App\Services\ChallengeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

// ============================================
// Lesson Controller
// ============================================
class LessonController extends Controller
{
    private LessonService $lessonService;

    public function __construct(LessonService $lessonService)
    {
        $this->lessonService = $lessonService;
    }

    public function index(Request $request)
    {
        try {
            $difficulty = $request->query('difficulty');
            $lessons = $this->lessonService->getAllLessons($difficulty);

            return response()->json(['data' => $lessons], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch lessons', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(string $slug)
    {
        try {
            $lesson = $this->lessonService->getLessonBySlug($slug);
            return response()->json(['data' => $lesson], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lesson not found'], 404);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'required|string',
            'difficulty' => 'required|in:beginner,intermediate,advanced',
            'xp_reward' => 'required|integer|min:0',
            'order_index' => 'nullable|integer',
            'is_published' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        try {
            $lesson = $this->lessonService->createLesson($request->all());
            return response()->json(['message' => 'Lesson created', 'data' => $lesson], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create lesson', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, int $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'content' => 'sometimes|string',
            'difficulty' => 'sometimes|in:beginner,intermediate,advanced',
            'xp_reward' => 'sometimes|integer|min:0',
            'order_index' => 'nullable|integer',
            'is_published' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        try {
            $lesson = $this->lessonService->updateLesson($id, $request->all());
            return response()->json(['message' => 'Lesson updated', 'data' => $lesson], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update lesson'], 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->lessonService->deleteLesson($id);
            return response()->json(['message' => 'Lesson deleted'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete lesson'], 500);
        }
    }
}
