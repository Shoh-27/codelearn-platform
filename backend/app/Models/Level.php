<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    use HasFactory;

    protected $fillable = [
        'level_number',
        'name',
        'xp_required',
        'badge_icon',
    ];

    protected $casts = [
        'level_number' => 'integer',
        'xp_required' => 'integer',
    ];

    public function users()
    {
        return $this->hasMany(UserProfile::class, 'current_level', 'level_number');
    }
}
