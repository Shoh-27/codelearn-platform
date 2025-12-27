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

    public function getLessonBySlug(string $slug)
    {
        $lesson = Lesson::where('slug', $slug)
            ->where('is_published', true)
            ->with('challenges')
            ->firstOrFail();

        return [
            'id' => $lesson->id,
            'title' => $lesson->title,
            'slug' => $lesson->slug,
            'description' => $lesson->description,
            'content' => $lesson->content,
            'difficulty' => $lesson->difficulty,
            'xp_reward' => $lesson->xp_reward,
            'challenges' => $lesson->challenges->map(fn($challenge) => [
                'id' => $challenge->id,
                'title' => $challenge->title,
                'slug' => $challenge->slug,
                'difficulty' => $challenge->difficulty,
                'xp_reward' => $challenge->xp_reward,
            ]),
        ];
    }

    public function createLesson(array $data): Lesson
    {
        return Lesson::create($data);
    }

    public function updateLesson(int $id, array $data): Lesson
    {
        $lesson = Lesson::findOrFail($id);
        $lesson->update($data);
        return $lesson->fresh();
    }

    public function deleteLesson(int $id): void
    {
        Lesson::findOrFail($id)->delete();
    }
}
