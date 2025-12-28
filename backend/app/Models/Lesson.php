<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'content',
        'difficulty',
        'xp_reward',
        'order_index',
        'is_published',
    ];

    protected $casts = [
        'xp_reward' => 'integer',
        'order_index' => 'integer',
        'is_published' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($lesson) {
            if (empty($lesson->slug)) {
                $lesson->slug = Str::slug($lesson->title);
            }
        });
    }

    public function challenges()
    {
        return $this->hasMany(Challenge::class);
    }

    public function userProgress()
    {
        return $this->hasMany(UserChallengeProgress::class);
    }
}
