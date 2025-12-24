<?php

namespace App\Services;

use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Carbon\Carbon;

class JWTService
{
    private string $secret;
    private int $ttl;
    private string $algo;

    public function __construct()
    {
        $this->secret = config('jwt.secret');
        $this->ttl = config('jwt.ttl');
        $this->algo = config('jwt.algo');
    }

    public function generateToken(User $user): string
    {
        $payload = [
            'iss' => config('app.url'),
            'sub' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
            'iat' => Carbon::now()->timestamp,
            'exp' => Carbon::now()->addMinutes($this->ttl)->timestamp,
        ];

        return JWT::encode($payload, $this->secret, $this->algo);
    }

    public function decodeToken(string $token): object
    {
        return JWT::decode($token, new Key($this->secret, $this->algo));
    }


}
