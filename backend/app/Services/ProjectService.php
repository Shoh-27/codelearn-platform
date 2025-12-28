<?php

namespace App\Services;

use App\Models\Project;
use App\Models\ProjectSubmission;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ProjectService
{
    private GamificationService $gamificationService;

    public function __construct(GamificationService $gamificationService)
    {
        $this->gamificationService = $gamificationService;
    }

    public function getAllProjects(?string $difficulty = null)
    {
        $query = Project::where('is_published', true);

        if ($difficulty) {
            $query->where('difficulty', $difficulty);
        }

        return $query->get()->map(fn($project) => [
            'id' => $project->id,
            'title' => $project->title,
            'slug' => $project->slug,
            'description' => $project->description,
            'difficulty' => $project->difficulty,
            'xp_reward' => $project->xp_reward,
            'estimated_hours' => $project->estimated_hours,
            'technologies' => $project->technologies,
            'submissions_count' => $project->submissions()->count(),
        ]);
    }

}
