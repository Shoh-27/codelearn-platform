<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ChallengeController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectSubmissionController;
use App\Http\Controllers\GamificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected Routes (Require Authentication)
Route::middleware(['jwt.auth'])->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // User Profile
    Route::prefix('profile')->group(function () {
        Route::get('/', [UserProfileController::class, 'show']);
        Route::put('/', [UserProfileController::class, 'update']);
        Route::get('/stats', [UserProfileController::class, 'stats']);
    });

    // Lessons
    Route::prefix('lessons')->group(function () {
        Route::get('/', [LessonController::class, 'index']);
        Route::get('/{slug}', [LessonController::class, 'show']);
    });

    // Challenges
    Route::prefix('challenges')->group(function () {
        Route::get('/', [ChallengeController::class, 'index']);
        Route::get('/{slug}', [ChallengeController::class, 'show']);
        Route::post('/{id}/submit', [ChallengeController::class, 'submit']);
        Route::get('/{id}/progress', [ChallengeController::class, 'progress']);
    });

    // Projects
    Route::prefix('projects')->group(function () {
        Route::get('/', [ProjectController::class, 'index']);
        Route::get('/{slug}', [ProjectController::class, 'show']);
    });

    // Project Submissions
    Route::prefix('submissions')->group(function () {
        Route::get('/', [ProjectSubmissionController::class, 'index']);
        Route::post('/', [ProjectSubmissionController::class, 'store']);
        Route::get('/{id}', [ProjectSubmissionController::class, 'show']);
    });

    // Gamification
    Route::prefix('gamification')->group(function () {
        Route::get('/leaderboard', [GamificationController::class, 'leaderboard']);
        Route::get('/badges', [GamificationController::class, 'badges']);
        Route::get('/levels', [GamificationController::class, 'levels']);
    });

    // Admin Routes
    Route::middleware(['admin'])->prefix('admin')->group(function () {

        // Lessons Management
        Route::prefix('lessons')->group(function () {
            Route::post('/', [LessonController::class, 'store']);
            Route::put('/{id}', [LessonController::class, 'update']);
            Route::delete('/{id}', [LessonController::class, 'destroy']);
        });

        // Challenges Management
        Route::prefix('challenges')->group(function () {
            Route::post('/', [ChallengeController::class, 'store']);
            Route::put('/{id}', [ChallengeController::class, 'update']);
            Route::delete('/{id}', [ChallengeController::class, 'destroy']);
        });

        // Projects Management
        Route::prefix('projects')->group(function () {
            Route::post('/', [ProjectController::class, 'store']);
            Route::put('/{id}', [ProjectController::class, 'update']);
            Route::delete('/{id}', [ProjectController::class, 'destroy']);
        });

        // Submission Review
        Route::prefix('submissions')->group(function () {
            Route::get('/pending', [ProjectSubmissionController::class, 'pending']);
            Route::put('/{id}/review', [ProjectSubmissionController::class, 'review']);
        });
    });
});
