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


}
