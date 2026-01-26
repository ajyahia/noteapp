<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class SharedNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'note_id',
        'user_id',
        'share_token',
    ];

    /**
     * Generate a unique share token
     */
    public static function generateToken(): string
    {
        do {
            $token = Str::random(32);
        } while (self::where('share_token', $token)->exists());
        
        return $token;
    }

    /**
     * Get the note that is shared
     */
    public function note()
    {
        return $this->belongsTo(Note::class);
    }

    /**
     * Get the user who shared the note
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
