<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AuthService
{
    private JWTService $jwtService;
    private GamificationService $gamificationService;

    public function __construct(JWTService $jwtService, GamificationService $gamificationService)
    {
        $this->jwtService = $jwtService;
        $this->gamificationService = $gamificationService;
    }

    public function register(array $data): array
    {
        DB::beginTransaction();

        try {
            // Create user
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => $data['role'] ?? 'student',
            ]);

            // Create user profile with initial gamification data
            UserProfile::create([
                'user_id' => $user->id,
                'current_xp' => 0,
                'current_level' => 1,
                'total_challenges_completed' => 0,
                'total_projects_completed' => 0,
            ]);

            // Award welcome badge if exists
            $this->gamificationService->checkAndAwardBadges($user);

            DB::commit();

            $token = $this->jwtService->generateToken($user);

            return [
                'user' => $user->load('profile'),
                'token' => $token,
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function login(array $credentials): array
    {
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Your account has been deactivated.'],
            ]);
        }

        $token = $this->jwtService->generateToken($user);

        return [
            'user' => $user->load('profile'),
            'token' => $token,
        ];
    }




}
