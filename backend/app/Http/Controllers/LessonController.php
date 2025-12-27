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


}
