<?php

namespace App\Http\Controllers;

use App\Services\LessonService;
use App\Services\ChallengeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChallengeController extends Controller
{
    private ChallengeService $challengeService;

    public function __construct(ChallengeService $challengeService)
    {
        $this->challengeService = $challengeService;
    }


}
