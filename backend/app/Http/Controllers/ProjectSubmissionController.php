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


}
