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

    public function getProjectBySlug(string $slug)
    {
        $project = Project::where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        return [
            'id' => $project->id,
            'title' => $project->title,
            'slug' => $project->slug,
            'description' => $project->description,
            'requirements' => $project->requirements,
            'difficulty' => $project->difficulty,
            'xp_reward' => $project->xp_reward,
            'estimated_hours' => $project->estimated_hours,
            'technologies' => $project->technologies,
        ];
    }

    public function submitProject(User $user, array $data): ProjectSubmission
    {
        DB::beginTransaction();

        try {
            $submission = ProjectSubmission::create([
                'user_id' => $user->id,
                'project_id' => $data['project_id'],
                'repository_url' => $data['repository_url'],
                'live_demo_url' => $data['live_demo_url'] ?? null,
                'description' => $data['description'] ?? null,
                'status' => 'pending',
                'submitted_at' => now(),
            ]);

            DB::commit();

            return $submission;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
