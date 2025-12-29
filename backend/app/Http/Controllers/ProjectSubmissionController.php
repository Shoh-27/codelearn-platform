<?php

namespace App\Http\Controllers;

use App\Services\ProjectService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProjectSubmissionController extends Controller
{
    private ProjectService $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    public function index()
    {
        try {
            $submissions = $this->projectService->getUserSubmissions(auth()->user());
            return response()->json(['data' => $submissions], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch submissions'], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'project_id' => 'required|exists:projects,id',
            'repository_url' => 'required|url',
            'live_demo_url' => 'nullable|url',
            'description' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        try {
            $submission = $this->projectService->submitProject(auth()->user(), $request->all());
            return response()->json([
                'message' => 'Project submitted successfully',
                'data' => $submission
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to submit project'], 500);
        }
    }

    public function show(int $id)
    {
        try {
            $submission = $this->projectService->getSubmissionById($id);
            return response()->json(['data' => $submission], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Submission not found'], 404);
        }
    }

    public function pending()
    {
        try {
            $submissions = $this->projectService->getPendingSubmissions();
            return response()->json(['data' => $submissions], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch pending submissions'], 500);
        }
    }

    public function review(Request $request, int $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:approved,rejected,revision_needed',
            'feedback' => 'nullable|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        try {
            $result = $this->projectService->reviewSubmission($id, auth()->user(), $request->all());
            return response()->json($result, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to review submission'], 500);
        }
    }
}
