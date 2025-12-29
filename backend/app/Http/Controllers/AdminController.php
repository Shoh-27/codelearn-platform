<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserProfile;
use App\Models\Challenge;
use App\Models\Project;
use App\Models\ProjectSubmission;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        try {
            $stats = [
                'total_users' => User::where('role', 'student')->count(),
                'active_users' => User::where('role', 'student')->where('is_active', true)->count(),
                'total_challenges' => Challenge::count(),
                'published_challenges' => Challenge::where('is_published', true)->count(),
                'total_projects' => Project::count(),
                'pending_submissions' => ProjectSubmission::where('status', 'pending')->count(),
                'total_xp_awarded' => UserProfile::sum('current_xp'),
                'avg_level' => UserProfile::avg('current_level'),
            ];

            $recentUsers = User::where('role', 'student')
                ->latest()
                ->take(10)
                ->get()
                ->map(fn($user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at->diffForHumans(),
                ]);

            $recentSubmissions = ProjectSubmission::with(['user', 'project'])
                ->latest()
                ->take(10)
                ->get()
                ->map(fn($sub) => [
                    'id' => $sub->id,
                    'user_name' => $sub->user->name,
                    'project_title' => $sub->project->title,
                    'status' => $sub->status,
                    'submitted_at' => $sub->submitted_at->diffForHumans(),
                ]);

            return response()->json([
                'data' => [
                    'stats' => $stats,
                    'recent_users' => $recentUsers,
                    'recent_submissions' => $recentSubmissions,
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch dashboard data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUsers(Request $request)
    {
        try {
            $query = User::where('role', 'student')->with('profile');

            if ($request->has('search')) {
                $search = $request->query('search');
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            }

            $users = $query->paginate(20);

            return response()->json([
                'data' => $users->map(fn($user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_active' => $user->is_active,
                    'current_level' => $user->profile->current_level ?? 1,
                    'current_xp' => $user->profile->current_xp ?? 0,
                    'created_at' => $user->created_at->format('Y-m-d'),
                ]),
                'meta' => [
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'per_page' => $users->perPage(),
                    'total' => $users->total(),
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch users'], 500);
        }
    }


}
