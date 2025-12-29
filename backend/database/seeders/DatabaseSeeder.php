<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\Level;
use App\Models\Badge;
use App\Models\Lesson;
use App\Models\Challenge;
use App\Models\Project;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        UserProfile::create(['user_id' => $admin->id]);

        // Create Sample Student
        $student = User::create([
            'name' => 'John Doe',
            'email' => 'student@example.com',
            'password' => Hash::make('password123'),
            'role' => 'student',
        ]);

        UserProfile::create([
            'user_id' => $student->id,
            'bio' => 'Aspiring full-stack developer',
            'github_url' => 'https://github.com/johndoe',
            'current_xp' => 250,
            'current_level' => 2,
        ]);

        // Seed Levels
        $levels = [
            ['level_number' => 1, 'name' => 'Beginner', 'xp_required' => 0],
            ['level_number' => 2, 'name' => 'Novice', 'xp_required' => 100],
            ['level_number' => 3, 'name' => 'Apprentice', 'xp_required' => 300],
            ['level_number' => 4, 'name' => 'Intermediate', 'xp_required' => 600],
            ['level_number' => 5, 'name' => 'Advanced', 'xp_required' => 1000],
            ['level_number' => 6, 'name' => 'Expert', 'xp_required' => 1500],
            ['level_number' => 7, 'name' => 'Master', 'xp_required' => 2500],
            ['level_number' => 8, 'name' => 'Grandmaster', 'xp_required' => 4000],
            ['level_number' => 9, 'name' => 'Legend', 'xp_required' => 6000],
            ['level_number' => 10, 'name' => 'Mythical', 'xp_required' => 10000],
        ];

        foreach ($levels as $level) {
            Level::create($level);
        }

        // Seed Badges
        $badges = [
            [
                'name' => 'First Steps',
                'description' => 'Complete your first challenge',
                'icon' => '🎯',
                'requirement_type' => 'challenges',
                'requirement_value' => 1,
            ],
            [
                'name' => 'Challenge Master',
                'description' => 'Complete 10 challenges',
                'icon' => '🏆',
                'requirement_type' => 'challenges',
                'requirement_value' => 10,
            ],
            [
                'name' => 'XP Hunter',
                'description' => 'Earn 500 XP',
                'icon' => '⭐',
                'requirement_type' => 'xp',
                'requirement_value' => 500,
            ],
            [
                'name' => 'Project Builder',
                'description' => 'Complete your first project',
                'icon' => '🚀',
                'requirement_type' => 'projects',
                'requirement_value' => 1,
            ],
            [
                'name' => 'Dedicated Learner',
                'description' => 'Earn 1000 XP',
                'icon' => '💎',
                'requirement_type' => 'xp',
                'requirement_value' => 1000,
            ],
        ];

        foreach ($badges as $badge) {
            Badge::create($badge);
        }

        // Seed Lessons
        $lessons = [
            [
                'title' => 'Introduction to JavaScript',
                'slug' => 'introduction-to-javascript',
                'description' => 'Learn the basics of JavaScript programming',
                'content' => "# Introduction to JavaScript

JavaScript is a versatile programming language primarily used for web development. In this lesson, we'll cover:

                ## Variables and Data Types
                - let, const, var
                - Numbers, strings, booleans
                - Arrays and objects

                ## Functions
                - Function declarations
                - Arrow functions
                - Parameters and return values

                ## Control Flow
                - if/else statements
                - switch statements
                - loops (for, while)

Let's get started with your first JavaScript program!",
                'difficulty' => 'beginner',
                'xp_reward' => 50,
                'order_index' => 1,
            ],
            [
                'title' => 'React Fundamentals',
                'slug' => 'react-fundamentals',
                'description' => 'Master the fundamentals of React',
                'content' => "# React Fundamentals

React is a popular JavaScript library for building user interfaces. Key concepts:

## Components
- Functional components
- Props
- State management

## Hooks
- useState
- useEffect
- Custom hooks

## JSX
- Rendering elements
- Conditional rendering
- Lists and keys",
                'difficulty' => 'intermediate',
                'xp_reward' => 75,
                'order_index' => 2,
            ],
        ];

        foreach ($lessons as $lessonData) {
            Lesson::create($lessonData);
        }

        // Seed Challenges
        $challenges = [
            [
                'lesson_id' => 1,
                'title' => 'Hello World',
                'slug' => 'hello-world',
                'description' => 'Write a function that returns "Hello, World!"',
                'difficulty' => 'beginner',
                'challenge_type' => 'coding',
                'xp_reward' => 50,
                'starter_code' => 'function helloWorld() {\n  // Your code here\n}',
                'solution_code' => 'function helloWorld() {\n  return "Hello, World!";\n}',
                'hints' => ['Use the return statement', 'String should be in quotes'],
            ],
            [
                'lesson_id' => 1,
                'title' => 'Sum Two Numbers',
                'slug' => 'sum-two-numbers',
                'description' => 'Create a function that adds two numbers',
                'difficulty' => 'beginner',
                'challenge_type' => 'coding',
                'xp_reward' => 75,
                'starter_code' => 'function sum(a, b) {\n  // Your code here\n}',
                'solution_code' => 'function sum(a, b) {\n  return a + b;\n}',
                'hints' => ['Use the + operator', 'Return the result'],
            ],
            [
                'lesson_id' => 2,
                'title' => 'Create a Counter Component',
                'slug' => 'create-counter-component',
                'description' => 'Build a React component with increment/decrement buttons',
                'difficulty' => 'intermediate',
                'challenge_type' => 'coding',
                'xp_reward' => 150,
                'starter_code' => 'import React, { useState } from "react";\n\nfunction Counter() {\n  // Your code here\n}',
                'solution_code' => 'import React, { useState } from "react";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+</button>\n      <button onClick={() => setCount(count - 1)}>-</button>\n    </div>\n  );\n}',
                'hints' => ['Use useState hook', 'Create click handlers for buttons'],
            ],
        ];

        foreach ($challenges as $challengeData) {
            Challenge::create($challengeData);
        }

        // Seed Projects
        $projects = [
            [
                'title' => 'Portfolio Website',
                'slug' => 'portfolio-website',
                'description' => 'Build a personal portfolio website showcasing your skills and projects',
                'requirements' => "- Responsive design\n- About section\n- Projects showcase\n- Contact form\n- Clean, modern UI",
                'difficulty' => 'beginner',
                'xp_reward' => 300,
                'estimated_hours' => 8,
                'technologies' => ['HTML', 'CSS', 'JavaScript'],
            ],
            [
                'title' => 'Todo App with React',
                'slug' => 'todo-app-react',
                'description' => 'Create a full-featured todo list application',
                'requirements' => "- Add/delete/edit todos\n- Mark as complete\n- Filter (all/active/completed)\n- Local storage persistence\n- Clean UI with Tailwind",
                'difficulty' => 'intermediate',
                'xp_reward' => 500,
                'estimated_hours' => 12,
                'technologies' => ['React', 'Tailwind CSS', 'Local Storage'],
            ],
            [
                'title' => 'E-commerce Dashboard',
                'slug' => 'ecommerce-dashboard',
                'description' => 'Build an admin dashboard for an e-commerce platform',
                'requirements' => "- Sales analytics charts\n- Product management\n- Order tracking\n- User management\n- Responsive design",
                'difficulty' => 'advanced',
                'xp_reward' => 800,
                'estimated_hours' => 20,
                'technologies' => ['React', 'Laravel API', 'Chart.js', 'Tailwind'],
            ],
        ];

        foreach ($projects as $projectData) {
            Project::create($projectData);
        }
    }
}
