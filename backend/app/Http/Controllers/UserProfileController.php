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

}
