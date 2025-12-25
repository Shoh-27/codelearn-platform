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

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'bio' => 'sometimes|string|max:1000',
            'github_url' => 'sometimes|url|nullable',
            'linkedin_url' => 'sometimes|url|nullable',
            'avatar' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = auth()->user();

            // Handle avatar upload separately
            if ($request->hasFile('avatar')) {
                $avatarUrl = $this->profileService->uploadAvatar($user, $request->file('avatar'));
            }

            $profile = $this->profileService->updateProfile($user, $request->all());

            return response()->json([
                'message' => 'Profile updated successfully',
                'data' => $profile
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }


}
