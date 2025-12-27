<?php

namespace App\Services;

use App\Models\Lesson;

class LessonService
{
    public function getAllLessons(?string $difficulty = null)
    {
        $query = Lesson::where('is_published', true)->orderBy('order_index');

        if ($difficulty) {
            $query->where('difficulty', $difficulty);
        }

        return $query->get()->map(fn($lesson) => [
            'id' => $lesson->id,
            'title' => $lesson->title,
            'slug' => $lesson->slug,
            'description' => $lesson->description,
            'difficulty' => $lesson->difficulty,
            'xp_reward' => $lesson->xp_reward,
            'challenges_count' => $lesson->challenges()->count(),
        ]);
    }


}
