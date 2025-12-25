<?php

namespace App\Http\Controllers;

use App\Services\UserProfileService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserProfileController extends Controller
{
    private UserProfileService $profileService;

    public function __construct(UserProfileService $profileService)
    {
        $this->profileService = $profileService;
    }

    public function show(Request $request)
    {
        try {
            $profile = $this->profileService->getProfile(auth()->user());

            return response()->json([
                'data' => $profile
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }


}
