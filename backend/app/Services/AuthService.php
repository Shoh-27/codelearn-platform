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


}
