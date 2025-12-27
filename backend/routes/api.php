<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
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

    // Gamification
    Route::prefix('gamification')->group(function () {
        Route::get('/leaderboard', [GamificationController::class, 'leaderboard']);
        Route::get('/badges', [GamificationController::class, 'badges']);
        Route::get('/levels', [GamificationController::class, 'levels']);
    });

});
