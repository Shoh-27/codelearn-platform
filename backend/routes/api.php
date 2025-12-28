<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ChallengeController;
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

    // Gamification
    Route::prefix('gamification')->group(function () {
        Route::get('/leaderboard', [GamificationController::class, 'leaderboard']);
        Route::get('/badges', [GamificationController::class, 'badges']);
        Route::get('/levels', [GamificationController::class, 'levels']);
    });

});
