<?php

namespace App\Http\Controllers;

use App\Services\ProjectService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{
    private ProjectService $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    public function index(Request $request)
    {
        try {
            $difficulty = $request->query('difficulty');
            $projects = $this->projectService->getAllProjects($difficulty);
            return response()->json(['data' => $projects], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch projects'], 500);
        }
    }

    public function show(string $slug)
    {
        try {
            $project = $this->projectService->getProjectBySlug($slug);
            return response()->json(['data' => $project], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Project not found'], 404);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'difficulty' => 'required|in:beginner,intermediate,advanced',
            'xp_reward' => 'required|integer|min:0',
            'estimated_hours' => 'nullable|integer',
            'technologies' => 'nullable|array',
            'is_published' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        try {
            $project = $this->projectService->createProject($request->all());
            return response()->json(['message' => 'Project created', 'data' => $project], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create project'], 500);
        }
    }


}
